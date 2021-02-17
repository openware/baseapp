package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func assertPagesEqual(t *testing.T, p1, p2 *Page) {
	assert.Equal(t, p1.Path, p2.Path)
	assert.Equal(t, p1.Lang, p2.Lang)
	assert.Equal(t, p1.Title, p2.Title)
	assert.Equal(t, p1.Description, p2.Description)
	assert.Equal(t, p1.Body, p2.Body)
}

func assertPagesSliceEqual(t *testing.T, p1, p2 []Page) {
	require.Equal(t, len(p1), len(p2))
	for i, p := range p1 {
		assertPagesEqual(t, &p, &p2[i])
	}
}

func TestPageModel(t *testing.T) {
	InitTestDB()
	h := Page{
		Path:        "/hello",
		Lang:        "en",
		Title:       "Hello world!",
		Description: "This is a greatings to the world",
		Body:        "",
	}

	c := Page{
		Path:        "/contact",
		Lang:        "en",
		Title:       "Contact us!",
		Description: "",
		Body:        "",
	}

	pages := []Page{h, c}
	db.Create(pages)
	p := &Page{}

	hi := p.FindByPath("/hello")
	ci := p.FindByPath("/contact")

	require.NotNil(t, hi)
	require.NotNil(t, ci)

	assertPagesEqual(t, &h, hi)
	assertPagesEqual(t, &c, ci)

	assertPagesSliceEqual(t, pages, p.List())
	assert.Nil(t, p.FindByPath("/terms"))
}
