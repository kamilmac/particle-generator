package main

import (
    // "fmt"
    // "sync"
    "time"
    "math/rand"
)

func main() {
    generator := Generator{}
    generator.Init()
    
    initWebSocket()
}


type Particle struct {
	X, Y, Z float64
    Size float64
    Color string
}

type Root Particle

type Generator struct {}

type ForceVector struct {
    X float64
    Y float64
    Z float64
}

type Modifier struct {
    *Root
    RandSpread float64
    ForceVector
    Stack []Particle
}

type RenderStore struct {
    Stack []Particle
}

func (m *Modifier) Force() {
    m.Root.X = m.Root.X + m.ForceVector.X
    m.Root.Y = m.Root.Y + m.ForceVector.Y
    m.Root.Z = m.Root.Z + m.ForceVector.Z
    
    renderStore.Stack = append(renderStore.Stack, Particle(*m.Root))
}

func (m *Modifier) Rand() {
    m.Root.X = m.Root.X + rand.Float64() * m.RandSpread - 0.5 * m.RandSpread 
    m.Root.Y = m.Root.Y + rand.Float64() * m.RandSpread - 0.5 * m.RandSpread 
    m.Root.Z = m.Root.Z + rand.Float64() * m.RandSpread - 0.5 * m.RandSpread 

    // fmt.Println("rand: ", m.Root)
}

var bornFreq = 0
var root = &Root{0,0,0,1,"#fff"}
var force = ForceVector{0.05,0.2,-0.1}
var modifier = Modifier{root, 14, force, []Particle{}}
var renderStore = RenderStore{[]Particle{}}
func (g *Generator) Init() {
    go func() {
        for {
            modifier.Force()
            modifier.Rand()
            renderStore.Append(modifier.Stack)
            if bornFreq > 0 {
                time.Sleep(time.Second / time.Duration(bornFreq))
            } else {
                time.Sleep(time.Second)
            }
        }
    }()
}

func (rs *RenderStore) Append(particles []Particle) {
    for _, p := range particles {
        rs.Stack = append(rs.Stack, p) 
    }
}

func (rs *RenderStore) GetAll() []Particle {
    return rs.Stack
}

func (rs *RenderStore) Empty() {
    rs.Stack = []Particle{}
}