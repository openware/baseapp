package daemons

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/openware/pkg/mngapi/peatio"
	"github.com/stretchr/testify/require"
	"gotest.tools/assert"
)

func TestGetResponseSuccess(t *testing.T) {
	mockedResponse := []byte(`{"currencies":[{"id":"aave","name":"Aave Token","description":"","parent_id":"","homepage":"","price":"1.0","type":"coin","deposit_enabled":true,"withdrawal_enabled":true,"deposit_fee":"0.0","min_deposit_amount":"0.13764625","withdraw_fee":"0.0","min_withdraw_amount":"0.13764625","withdraw_limit_24h":"0.0","withdraw_limit_72h":"0.0","base_factor":1000000000000000000,"precision":8,"position":1,"icon_url":"https://app.storage.yellow.com/uploads/asset/icon/aave/67ba0cd807.png"}],"markets":[{"id":"omgusdt","name":"OMG/USDT","base_unit":"omg","quote_unit":"usdt","state":"enabled","amount_precision":2,"price_precision":4,"min_price":"0.0037","max_price":"3687.4597","min_amount":"0.01","position":9}]}`)
	marketPeatioResponse := []byte(`{"id":"omgusdt","name":"OMG/USDT","base_unit":"omg","quote_unit":"usdt","state":"enabled","amount_precision":2,"price_precision":4,"min_price":"0.0037","max_price":"3687.4597","min_amount":"0.01","position":9}`)
	currencyPeatioResponse := []byte(`{"id":"aave","name":"Aave Token","description":null,"homepage":null,"price":"1.0","explorer_transaction":"https://rinkeby.etherscan.io/tx/#{txid}","explorer_address":"https://rinkeby.etherscan.io/address/#{address}","type":"coin","deposit_enabled":true,"withdrawal_enabled":true,"deposit_fee":"0.0","min_deposit_amount":"0.13764625","withdraw_fee":"0.0","min_withdraw_amount":"0.13764625","withdraw_limit_24h":"0.0","withdraw_limit_72h":"0.0","base_factor":1000000000000000000,"precision":8,"position":1,"icon_url":"https://app.storage.yellow.com/uploads/asset/icon/aave/67ba0cd807.png","min_confirmations":6}`)
	mux := http.NewServeMux()
	mux.HandleFunc("/api/v2/opx/markets", func(res http.ResponseWriter, req *http.Request) {
		res.Write(mockedResponse)
	})
	mux.HandleFunc("/api/v2/peatio/management/markets/new", func(res http.ResponseWriter, req *http.Request) {
		res.Write(marketPeatioResponse)
	})
	mux.HandleFunc("/api/v2/peatio/management/currencies/create", func(res http.ResponseWriter, req *http.Request) {
		res.Write(currencyPeatioResponse)
	})

	ts := httptest.NewServer(mux)
	defer ts.Close()

	peatioClient, err := peatio.New(fmt.Sprintf("%s/api/v2/peatio/management", ts.URL), jwtIssuer, jwtAlgo, jwtPrivateKey)
	require.NoError(t, err)

	app := initApp()
	app.Conf.Opendax.Addr = ts.URL
	res := FetchMarketsFromOpenfinexCloud(peatioClient, app.Conf.Opendax.Addr, "platformID")
	assert.Equal(t, res, nil)
}

func TestGetResponseEmptyResponse(t *testing.T) {
	mockedResponse := []byte(`{}`)
	mux := http.NewServeMux()

	mux.HandleFunc("/api/v2/opx/markets", func(res http.ResponseWriter, req *http.Request) {
		res.Write(mockedResponse)
	})

	ts := httptest.NewServer(mux)
	defer ts.Close()

	peatioClient, err := peatio.New(fmt.Sprintf("%s/api/v2/peatio/management", ts.URL), jwtIssuer, jwtAlgo, jwtPrivateKey)
	require.NoError(t, err)

	app := initApp()
	app.Conf.Opendax.Addr = ts.URL
	res := FetchMarketsFromOpenfinexCloud(peatioClient, app.Conf.Opendax.Addr, "platformID")
	assert.Equal(t, res, nil)
}

func TestFetchMarketsFromOpenfinexCloudHostError(t *testing.T) {
	response := "Unexpected status: 404"
	mux := http.NewServeMux()

	ts := httptest.NewServer(mux)
	defer ts.Close()

	peatioClient, err := peatio.New(fmt.Sprintf("%s/api/v2/peatio/management", ts.URL), jwtIssuer, jwtAlgo, jwtPrivateKey)
	require.NoError(t, err)

	app := initApp()
	app.Conf.Opendax.Addr = ts.URL
	res := FetchMarketsFromOpenfinexCloud(peatioClient, app.Conf.Opendax.Addr, "platfromID")
	require.Error(t, res)
	assert.Equal(t, res.Error(), response)
}
