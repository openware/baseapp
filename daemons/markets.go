package daemons

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/openware/kaigara/pkg/vault"
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

func FetchMarkets(peatioClient *peatio.Client, vaultService *vault.Service, opendaxAddr string) {
	for {
		platformID, err := getPlatformIDFromVault(vaultService)
		if err != nil {
			log.Printf("ERR: FetchMarkets: %v", err.Error())
		} else {
			FetchMarketsFromOpenfinexCloud(peatioClient, opendaxAddr, platformID)
		}
		<-time.After(5 * time.Minute)
	}
}

func FetchMarketsFromOpenfinexCloud(peatioClient *peatio.Client, opendaxAddr string, platformID string) error {
	url := fmt.Sprintf("%s/api/v2/opx/markets", opendaxAddr)
	response, err := getResponse(url, platformID)

	if err != nil {
		return err
	}

	// Create currencies
	createCurrencies(peatioClient, response.Currencies)

	// Create markets
	createMarkets(peatioClient, response.Markets)

	return nil
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
		log.Printf("ERROR: getResponse: Unexpected status: %d", resp.StatusCode)
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
				Type:                currency.Type,
				BaseFactor:          currency.BaseFactor,
				Position:            currency.Position,
				DepositFee:          currency.DepositFee,
				MinDepositAmount:    currency.MinDepositAmount,
				WithdrawFee:         currency.WithdrawFee,
				MinCollectionAmount: currency.MinDepositAmount,
				MinWithdrawAmount:   currency.MinWithdrawAmount,
				WithdrawLimit24:     currency.WithdrawLimit24h,
				WithdrawLimit72:     currency.WithdrawLimit72h,
				DepositEnabled:      currency.DepositEnabled,
				WithdrawEnabled:     currency.WithdrawalEnabled,
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

func createMarkets(peatioClient *peatio.Client, markets []MarketResponse) {
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
		}
	}
}
