package main

import (
    "fmt"
    "net/http"
    "golang.org/x/net/websocket"
    "github.com/pquerna/ffjson/ffjson"
)

func initWebSocket() {
    fmt.Println("Starting websock server: ")
    // http.Handle("/getparticles", websocket.Handler(getParticlesHandler))
    http.Handle("/getparticles", websocket.Handler(getParticlesHandler))
    err := http.ListenAndServe(":5060", nil)
    if err != nil {
        panic("ListenAndServe: " + err.Error())
    }
}

type MidiData struct {
    BornFreq int
}

func getParticlesHandler(ws *websocket.Conn) {
    for {
        var midi []byte
        var m MidiData
        
        websocket.Message.Receive(ws, &midi);
        ffjson.Unmarshal(midi, &m)
        fmt.Println("socket received: ", m)
        bornFreq = m.BornFreq

        // updateMidi(midi)
        particles, _ := ffjson.Marshal(renderStore.GetAll())
        renderStore.Empty() 
        websocket.Message.Send(ws, string(particles))
    }
}