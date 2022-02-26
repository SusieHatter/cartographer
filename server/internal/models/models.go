package models

type MapImage struct {
	Id         int    `json:"id"`
	DataUrl    string `json:"dataUrl"`
	Name       string `json:"name"`
	LastEdited int64  `json:"lastEdited"`
}
