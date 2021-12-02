package daemons

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"path"
	"strings"
	"time"

	jwtgo "github.com/dgrijalva/jwt-go"
	"github.com/openware/kaigara/pkg/vault"
	sonic "github.com/openware/pkg/sonic/config"
)

// LicenseResponse to store response from api
type LicenseResponse struct {
	License string `json:"license"`
	Expire  int64  `json:"expire"`
}

type License struct {
	Finex struct {
		Creation int64 `json:"creation"`
		Expire   int64 `json:"expire"`
	}
}

func parseLicense(lic string) (int64, int64, error) {
	s := strings.Split(lic, ".")
	if len(s) != 3 {
		return 0, 0, fmt.Errorf("ERR: parseLicense: unexpected license format")
	}

	data, err := base64.RawURLEncoding.DecodeString(s[1])
	if err != nil {
		return 0, 0, fmt.Errorf("ERR: parseLicense: license decode: %s", err)
	}

	var license License
	err = json.Unmarshal(data, &license)
	if err != nil {
		return 0, 0, fmt.Errorf("ERR: parseLicense: license unmarshal: %s", err)
	}

	return license.Finex.Expire, license.Finex.Creation, nil
}

// LicenseRenewal to periodic check and renew license before expire
func LicenseRenewal(appName string, app *sonic.Runtime, vaultService *vault.Service) {
	for {
		for {
			lic, err := getLicenseFromVault(appName, vaultService)
			if err != nil {
				log.Printf("ERROR: LicenseRenewal: %s", err)
				break
			}

			expire, creation, err := parseLicense(lic)
			if err != nil {
				log.Println(err.Error())
				break
			}

			if expire == 0 {
				log.Println("INFO: LicenseRenewal: the license does not expire")
				break
			}

			// Check to skip renewal (less than 75% of expire time)
			if time.Now().Unix() < creation+((expire-creation)*75/100) {
				log.Println("INFO: LicenseRenewal: skipped")
				break
			}

			err = CreateNewLicense(appName, &app.Conf.Opendax, vaultService)
			if err != nil {
				log.Println(err.Error())
				break
			}
			log.Println("INFO: LicenseRenewal: renewed")

			break
		}

		time.Sleep(time.Minute * 15) // FIXME: Adjust polling period
	}
}

func CreateNewLicense(appName string, opendaxConfig *sonic.OpendaxConfig, vaultService *vault.Service) error {
	platformID, err := getPlatformIDFromVault(vaultService)
	if err != nil {
		return err
	}

	url, err := url.Parse(opendaxConfig.Addr)
	if err != nil {
		return err
	}
	url.Path = path.Join(url.Path, "/api/v2/opx/sonic/licenses/new")

	privRaw, err := getPrivateKeyFromVault(vaultService)
	if err != nil {
		return err
	}

	privPEM, err := base64.StdEncoding.DecodeString(privRaw)
	if err != nil {
		return err
	}

	key, err := jwtgo.ParseRSAPrivateKeyFromPEM(privPEM)
	if err != nil {
		return err
	}
	t := jwtgo.New(jwtgo.GetSigningMethod("RS256"))
	jwtToken, err := t.SignedString(key)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPost, url.String(), nil)
	if err != nil {
		return err
	}
	// Add request header
	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("PlatformID", platformID)
	req.Header.Add("Authorization", "Bearer "+jwtToken)
	// Call HTTP request
	httpClient := &http.Client{}
	res, err := httpClient.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	// Convert response body to []byte
	resBody, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}
	// Check for API error
	if res.StatusCode != http.StatusCreated {
		return fmt.Errorf("ERROR: CreateNewLicense: Unexpected opx API response status %d", res.StatusCode)
	}

	license := LicenseResponse{}
	err = json.Unmarshal(resBody, &license)
	if err != nil {
		return err
	}

	err = saveLicenseToVault(appName, vaultService, license.License)
	if err != nil {
		return err
	}

	return nil
}

func getPlatformIDFromVault(vaultService *vault.Service) (string, error) {
	app := "peatio"
	scope := "private"
	key := "platform_id"

	// Load secret
	vaultService.LoadSecrets(app, scope)

	// Get secret
	result, err := vaultService.GetSecret(app, key, scope)
	if err != nil {
		return "", err
	}

	if result == nil {
		return "", fmt.Errorf("ERROR: getPlatformIDFromVault: kaigara config %s.%s.%s not found", app, scope, key)
	}

	return result.(string), nil
}

func getPrivateKeyFromVault(vaultService *vault.Service) (string, error) {
	app := "sonic"
	scope := "secret"
	key := "jwt_private_key"

	// Load secret
	vaultService.LoadSecrets(app, scope)

	// Get secret
	result, err := vaultService.GetSecret(app, key, scope)
	if err != nil {
		return "", err
	}

	return result.(string), nil
}

func getLicenseFromVault(app string, vaultService *vault.Service) (string, error) {
	scope := "secret"

	// Load secret
	vaultService.LoadSecrets(app, scope)

	// Get secret
	licRaw, err := vaultService.GetSecret(app, "finex_license_key", scope)
	if err != nil {
		return "", err
	}

	lic, ok := licRaw.(string)
	if !ok {
		return "", fmt.Errorf("ERROR: getLicenseFromVault: The license key is empty in Vault")
	}

	return lic, nil
}

func saveLicenseToVault(app string, vaultService *vault.Service, license string) error {
	scope := "secret"

	// Load secret
	vaultService.LoadSecrets(app, scope)

	// Get secret
	err := vaultService.SetSecret(app, "finex_license_key", license, scope)
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
