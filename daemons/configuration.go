package daemons

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	funk "github.com/thoas/go-funk"

	"github.com/openware/kaigara/pkg/vault"
	"github.com/openware/pkg/mngapi"
	"github.com/openware/pkg/mngapi/peatio"
)

// Define response data
type MarketResponse struct {
	ID              string `json:"id"`
	Name            string `json:"name"`
	BaseUnit        string `json:"base_unit"`
	QuoteUnit       string `json:"quote_unit"`
	State           string `json:"state"`
	AmountPrecision int64  `json:"amount_precision"`
	PricePrecision  int64  `json:"price_precision"`
	MinPrice        string `json:"min_price"`
	MaxPrice        string `json:"max_price"`
	MinAmount       string `json:"min_amount"`
	Position        int64  `json:"position"`
}

// Define currency response data
type CurrencyResponse struct {
	ID                string `json:"id"`
	Name              string `json:"name"`
	Description       string `json:"description"`
	ParentID          string `json:"parent_id"`
	Homepage          string `json:"homepage"`
	Price             string `json:"price"`
	Type              string `json:"type"`
	DepositEnabled    bool   `json:"deposit_enabled"`
	WithdrawalEnabled bool   `json:"withdrawal_enabled"`
	DepositFee        string `json:"deposit_fee"`
	MinDepositAmount  string `json:"min_deposit_amount"`
	WithdrawFee       string `json:"withdraw_fee"`
	MinWithdrawAmount string `json:"min_withdraw_amount"`
	WithdrawLimit24h  string `json:"withdraw_limit_24h"`
	WithdrawLimit72h  string `json:"withdraw_limit_72h"`
	BaseFactor        int64  `json:"base_factor"`
	Precision         int64  `json:"precision"`
	Position          int64  `json:"position"`
	IconUrl           string `json:"icon_url"`
}

type Response struct {
	Currencies []CurrencyResponse `json:"currencies"`
	Markets    []MarketResponse   `json:"markets"`
}

func FetchConfigurationPeriodic(peatioClient *peatio.Client, vaultService *vault.Service, opendaxAddr string) {
	for {
		platformID, err := getPlatformIDFromVault(vaultService)
		if err != nil {
			log.Printf("ERROR: FetchMarkets: %v", err.Error())
		} else {
			if shouldRestart, err := fetchConfiguration(peatioClient, opendaxAddr, platformID); err == nil && shouldRestart {
				go setFinexRestart(vaultService, time.Now().Unix())
			}
		}
		<-time.After(15 * time.Minute)
	}
}
func fetchConfiguration(peatioClient *peatio.Client, opendaxAddr, platformID string) (bool, error) {
	url := fmt.Sprintf("%s/api/v2/opx/markets", opendaxAddr)
	response, err := getResponse(url, platformID)
	log.Printf("INFO: Started fetching configuration")

	if err != nil {
		return false, err
	}

	// Create currencies
	createCurrencies(peatioClient, response.Currencies)

	// Create markets
	shouldRestart := createMarkets(peatioClient, response.Markets)

	// Create wallets
	createWallets(peatioClient, opendaxAddr, response.Currencies)
	return shouldRestart, nil
}

func FetchConfiguration(peatioClient *peatio.Client, opendaxAddr string, platformID string) error {
	_, err := fetchConfiguration(peatioClient, opendaxAddr, platformID)
	return err
}

func getResponse(url string, platformID string) (*Response, error) {
	req, err := http.NewRequest(http.MethodGet, url, nil)

	if err != nil {
		log.Printf("ERROR: getResponse: Can't fetch markets: %v", err.Error())
		return nil, err
	}

	// Add request header
	req.Header.Add("PlatformID", platformID)

	// Call HTTP request
	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		log.Printf("ERROR: getResponse: Request failed: %v", err.Error())
		return nil, err
	}
	defer resp.Body.Close()

	// Convert response body to []byte
	resBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Printf("ERROR: getResponse: Can't convert body to []: %d -> %v", resp.StatusCode, err.Error())
		return nil, err
	}
	// Check for API error
	if resp.StatusCode != http.StatusOK {
		log.Printf("ERROR: getResponse: Unexpected status: %d with contents: %s", resp.StatusCode, string(resBody))
		return nil, errors.New(fmt.Sprintf("Unexpected status: %d", resp.StatusCode))
	}

	// Unmarshal response body result
	response := &Response{}
	marshalErr := json.Unmarshal(resBody, response)
	if marshalErr != nil {
		log.Printf("ERROR: getResponse: Can't unmarshal response. %v", marshalErr)
		return nil, marshalErr
	}
	return response, nil
}

func createCurrencies(peatioClient *peatio.Client, currencies []CurrencyResponse) {
	for _, currency := range currencies {
		// Find currency by code, if there is no system will create
		res, apiError := peatioClient.GetCurrencyByCode(currency.ID)
		// Check result here
		if res == nil && apiError != nil {
			currencyParams := peatio.CreateCurrencyParams{
				Code:                currency.ID,
				Name:                currency.Name,
				Type:                currency.Type,
				BaseFactor:          currency.BaseFactor,
				Position:            currency.Position,
				DepositFee:          currency.DepositFee,
				ParentID:            currency.ParentID,
				MinDepositAmount:    currency.MinDepositAmount,
				WithdrawFee:         currency.WithdrawFee,
				MinCollectionAmount: currency.MinDepositAmount,
				MinWithdrawAmount:   currency.MinWithdrawAmount,
				WithdrawLimit24:     currency.WithdrawLimit24h,
				WithdrawLimit72:     currency.WithdrawLimit72h,
				DepositEnabled:      false,
				WithdrawEnabled:     false,
				Visible:             false,
				Precision:           currency.Precision,
				Price:               currency.Price,
				IconURL:             currency.IconUrl,
				Description:         currency.Description,
				Homepage:            currency.Homepage,
			}
			if currency.Type == "coin" {
				currencyParams.BlockchainKey = "opendax-cloud"
			}

			_, apiError := peatioClient.CreateCurrency(currencyParams)
			if apiError != nil {
				log.Printf("ERROR: createCurrencies: Can't create currency with code %s. Error: %v. Errors: %v", currency.ID, apiError.Error, apiError.Errors)
			}
		}
	}
}

func createMarkets(peatioClient *peatio.Client, markets []MarketResponse) (shouldRestart bool) {
	for _, market := range markets {
		// Find market by ID, if there is no system will create
		res, apiError := peatioClient.GetMarketByID(market.ID)
		// Check result here
		if res == nil && apiError != nil {
			marketParams := peatio.CreateMarketParams{
				BaseCurrency:    market.BaseUnit,
				QuoteCurrency:   market.QuoteUnit,
				State:           "disabled",
				EngineName:      "opendax-cloud-engine",
				AmountPrecision: market.AmountPrecision,
				PricePrecision:  market.PricePrecision,
				MinPrice:        market.MinPrice,
				MaxPrice:        market.MaxPrice,
				MinAmount:       market.MinAmount,
				Position:        market.Position,
			}

			_, apiError := peatioClient.CreateMarket(marketParams)
			if apiError != nil {
				log.Printf("ERROR: createMarkets: Can't create market with id %s. Error: %v. Errors: %v", market.ID, apiError.Error, apiError.Errors)
			}
		} else if res != nil {
			shouldSendRequest := false
			marketParams := peatio.UpdateMarketParams{
				ID:              res.ID,
				EngineID:        strconv.Itoa(res.EngineID),
				MinPrice:        res.MinPrice,
				MaxPrice:        res.MaxPrice,
				MinAmount:       res.MinAmount,
				AmountPrecision: int64(res.AmountPrecision),
				PricePrecision:  int64(res.PricePrecision),
			}

			if market.MinPrice > res.MinPrice || market.MinAmount > res.MinAmount {
				marketParams.MinPrice = market.MinPrice
				marketParams.MaxPrice = market.MaxPrice
				marketParams.MinAmount = market.MinAmount
				shouldSendRequest = true
			}

			if market.AmountPrecision != int64(res.AmountPrecision) || market.PricePrecision != int64(res.PricePrecision) {
				marketParams.AmountPrecision = market.AmountPrecision
				marketParams.PricePrecision = market.PricePrecision
				marketParams.MinPrice = market.MinPrice
				marketParams.MaxPrice = market.MaxPrice
				marketParams.MinAmount = market.MinAmount
				shouldSendRequest = true
			}

			if shouldSendRequest {
				_, apiError := peatioClient.UpdateMarket(marketParams)
				log.Printf("INFO: createMarkets: updating: {\"from\": %+v, \"to\": %+v}", *res, marketParams)
				if apiError != nil {
					log.Printf("ERROR: createMarkets: Can't update market with id %s. Error: %v. Errors: %v", market.ID, apiError.Error, apiError.Errors)
				} else {
					shouldRestart = true
				}
			}
		}
	}
	return
}

// Method createWallets creates or updates wallet configuration
func createWallets(peatioClient *peatio.Client, opendaxAddr string, currencies []CurrencyResponse) {
	wallets, apiError := peatioClient.GetWallets()
	if apiError != nil {
		log.Printf("ERROR: createWallets: Can't get all wallets info. Error: %v. Errors: %v", apiError.Error, apiError.Errors)
		return
	}

	currenciesGroups := divideCurrenciesIntoGroups(currencies)
	if len(wallets) == 0 {
		for _, currencyGroup := range currenciesGroups {
			createDepositAndHotWallet(peatioClient, currencyGroup, opendaxAddr)
		}
	} else {
		updateWalletsGroup(peatioClient, wallets, currenciesGroups, opendaxAddr)
	}
}

// Method updateWalletsGroup updates wallets which has partial or none match
func updateWalletsGroup(peatioClient *peatio.Client, wallets []*peatio.Wallet, currenciesGroups map[string][]string, opendaxAddr string) {
	for _, currencyGroup := range currenciesGroups {
		walletsGroup := findCurrenciesInWallets(wallets, currencyGroup)
		for walletKey, walletsGroup := range walletsGroup {
			// If wallet constains partially filled currencies
			// System will update current wallet with all currencies list
			// If wallet doesn't contain currencies
			// System will update/create wallet
			if walletKey == "partial" {
				for _, w := range walletsGroup {
					updatePartiallyMatchedWallet(peatioClient, w, currencyGroup)
				}
			} else if walletKey == "none" {
				createDepositAndHotWallet(peatioClient, currencyGroup, opendaxAddr)
			}
		}
	}
}

// Method updatePartiallyMatchedWallet updates partially matched wallet
func updatePartiallyMatchedWallet(peatioClient *peatio.Client, w *peatio.Wallet, currencyGroup []string) {
	res, err := getWallet(peatioClient, w)
	if err != nil {
		// For example, If there is difference in second slice
		// It means that second slice is not fully included on first slice
		// []string{"eth", "link", "usdt"} VS []string{"eth", "link"}
		// res: []string{"usdt"}, []string{}
		_, secondDiff := funk.Difference(res.Currencies, currencyGroup)
		if len(secondDiff.([]string)) > 0 {
			mergedCurrencies := append(res.Currencies, currencyGroup...)
			updateWallet(peatioClient, w, funk.UniqString(mergedCurrencies))
		}
	}
}

// Method divideCurrenciesIntoGroups divides currencies into groups
// In first place system always puts parent ID
// For example {"eth": ["eth", "usdt", "link"]}
func divideCurrenciesIntoGroups(currencies []CurrencyResponse) map[string][]string {
	res := make(map[string][]string)
	// Sort currencies with empty Parent ID first
	// It means those currencies should have separate wallet
	sort.SliceStable(currencies, func(i, j int) bool {
		return currencies[i].ParentID < currencies[j].ParentID
	})

	for _, currency := range currencies {
		if currency.Type == "coin" {
			if currency.ParentID == "" {
				res[currency.ID] = append(res[currency.ID], currency.ID)
			} else {
				res[currency.ParentID] = append(res[currency.ParentID], currency.ID)
			}
		}
	}

	return res
}

// Method createDepositAndHotWallet creates deposit and hot wallet
func createDepositAndHotWallet(peatioClient *peatio.Client, currencies []string, opendaxAddr string) *mngapi.APIError {
	// Shared params
	params := peatio.CreateWalletParams{
		BlockchainKey: "opendax-cloud",
		Gateway:       "opendax_cloud",
		Currencies:    currencies,
		Status:        "active",
		Settings: peatio.Settings{
			URI: fmt.Sprintf("%v/api/v2/opx/peatio", opendaxAddr),
		},
	}
	// Create Deposit Wallet
	depositWalletParams := params
	depositWalletParams.Kind = "deposit"
	depositWalletParams.Name = fmt.Sprintf("%s Deposit Wallet", strings.ToUpper(currencies[0]))

	_, depositApiError := peatioClient.CreateWallet(depositWalletParams)
	if depositApiError != nil {
		log.Printf("ERROR: createWallets: Can't create deposit wallet. Error: %v. Errors: %v", depositApiError.Error, depositApiError.Errors)
		return depositApiError
	}

	// Create Hot Wallet
	hotWalletParams := params
	hotWalletParams.Kind = "hot"
	hotWalletParams.Name = fmt.Sprintf("%s Hot Wallet", strings.ToUpper(currencies[0]))

	_, hotApiError := peatioClient.CreateWallet(hotWalletParams)
	if hotApiError != nil {
		log.Printf("ERROR: createWallets: Can't create deposit wallet. Error: %v. Errors: %v", hotApiError.Error, hotApiError.Errors)
		return hotApiError
	}

	return nil
}

// Method findCurrenciesInWallets finds wallet by set of currencies
func findCurrenciesInWallets(wallets []*peatio.Wallet, currencies []string) map[string][]*peatio.Wallet {
	res := map[string][]*peatio.Wallet{}

	// Sort currencies to make sure it will be in right order with wallet currencies
	newCurrencies := make([]string, len(currencies))
	copy(newCurrencies, currencies)
	sort.Strings(newCurrencies)

	funk.ForEach(wallets, func(wallet *peatio.Wallet) {
		// Sort wallet currencies
		sort.Strings(wallet.Currencies)
		// Wallet currencies and currencies from master platform
		// should be equal to have full match
		// Wallet currencies should contain currencies from master platform
		// to have partial match

		if funk.IsEqual(wallet.Currencies, newCurrencies) {
			res["full"] = append(res["full"], wallet)
		} else if len(funk.IntersectString(wallet.Currencies, newCurrencies)) > 0 && !funk.Contains(res["full"], wallet) {
			res["partial"] = append(res["partial"], wallet)
		}
	})
	// System should return result if there is a full/partial match
	if len(res["full"]) != 0 || len(res["partial"]) != 0 {
		return res
	}

	// Return empty wallet if there is no match
	res["none"] = []*peatio.Wallet{}

	return res
}

// Method updateWallet updates wallet currencies through management API
func updateWallet(peatioClient *peatio.Client, wallet *peatio.Wallet, currencies []string) *mngapi.APIError {
	updateWalletParams := peatio.UpdateWalletParams{
		ID:         fmt.Sprint(wallet.ID),
		Currencies: currencies,
	}
	_, apiErr := peatioClient.UpdateWallet(updateWalletParams)
	if apiErr != nil {
		log.Printf("ERROR: updateWallet: Can't update wallet currencies. Error: %v. Errors: %v", apiErr.Error, apiErr.Errors)
		return apiErr
	}
	return nil
}

// Method getWallet gets wallet by ID
func getWallet(peatioClient *peatio.Client, wallet *peatio.Wallet) (*peatio.Wallet, *mngapi.APIError) {
	res, apiErr := peatioClient.GetWalletByID(wallet.ID)
	if apiErr != nil {
		log.Printf("ERROR: updateWallet: Can't update wallet currencies. Error: %v. Errors: %v", apiErr.Error, apiErr.Errors)
		return nil, apiErr
	}
	return res, nil
}

func GetXLNEnabledFromVault(vaultService *vault.Service) (bool, error) {
	app := "sonic"
	scope := "private"
	key := "xln_enabled"

	// Load secret
	vaultService.LoadSecrets(app, scope)
	// Get secret
	result, err := vaultService.GetSecret(app, key, scope)
	if err != nil {
		return false, err
	}

	if result == nil {
		result = false
	}

	return result.(bool), nil
}
func setFinexRestart(vaultService *vault.Service, timestamp int64) error {
	app := "finex"
	scope := "private"
	log.Printf("INFO: Finex should restart")

	// Load secret
	vaultService.LoadSecrets(app, scope)

	// Get secret
	err := vaultService.SetSecret(app, "finex_restart", timestamp, scope)
	if err != nil {
		return err
	}

	// Save secret
	err = vaultService.SaveSecrets(app, scope)
	if err != nil {
		return err
	}

	return nil
}
func getFinexRestart(vaultService *vault.Service) (int64, error) {
	app := "finex"
	scope := "private"

	// Load secret
	vaultService.LoadSecrets(app, scope)

	// Get secret
	finRaw, err := vaultService.GetSecret(app, "finex_restart", scope)
	if err != nil {
		return 0, err
	}

	finTimestamp, ok := finRaw.(int64)
	if !ok {
		return 0, fmt.Errorf("ERROR: getFinexRestart: cannot convert value to unix timestamp: %v", finRaw)
	}

	return finTimestamp, nil
}
