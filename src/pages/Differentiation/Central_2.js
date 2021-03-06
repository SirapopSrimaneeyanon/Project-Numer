import React, { Component } from 'react'
import { Card, Input, Button , Layout} from 'antd';
import 'antd/dist/antd.css';
import {compile,derivative} from 'mathjs'
import axios from 'axios'

const {Content} = Layout;

const InputStyle = { //<<=== Input Font Format

    color: "black",
    fontWeight: "bold",
    fontSize: "24px"

};

var y, exact, error;

class Central_2 extends Component {

    constructor() {

        super();
        this.state = {
            fx: "",
            x: 0,
            h: 0,
            degree: 0,
            showOutputCard: true,
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {

        this.setState({
            [event.target.name]: event.target.value
        });

    }
    central_2(x, h, degree) {
        switch (degree) {
            /*case 1:
                y = (this.func(x+(1*h)) - this.func(x-(1*h))) / (2*h)
                break;
            case 2:
                y = (this.func(x+(1*h)) - 2*this.func(x) + this.func(x-(1*h))) / Math.pow(h, 2)
                break;
            case 3:
                y = (this.func(x+(2*h)) - 2*this.func(x+(1*h)) + 2*this.func(x-(1*h)) - this.func(x-(2*h))) / (2*Math.pow(h, 3))
                break;
            default:
                y = (this.func(x+(2*h)) - 4*this.func(x+(1*h)) + 6*this.func(x) - 4*this.func(x-(1*h)) + this.func(x-(2*h))) / Math.pow(h, 4)
                */

            case 1:
                y = (-this.func(x+(2*h)) + 8*this.func(x+(1*h)) - 8*this.func(x-(1*h)) + this.func(x-(2*h))) / (12*h)
                break;
            case 2:
                y = (-this.func(x+(2*h)) + 16*this.func(x+(1*h)) - 30*this.func(x) + 16*this.func(x-(1*h)) - this.func(x-(2*h))) / (12*Math.pow(h, 2))
                break;
            case 3:
                y = (-this.func(x+(3*h)) + 8*this.func(x+(2*h)) - 13*this.func(x+(1*h)) + 13*this.func(x-(1*h)) - 8*this.func(x-(2*h)) + this.func(x-(3*h))) / (8*Math.pow(h, 3))
                break;
            default:
                y = (-this.func(x+(3*h)) + 12*this.func(x+(2*h)) - 39*this.func(x+(1*h)) + 56*this.func(x) - 39*this.func(x-(1*h)) + 12*this.func(x-(2*h)) + this.func(x-(3*h))) / (6*Math.pow(h, 4))

        }

        exact = this.funcDiff(x, degree)
        error = Math.abs((y - exact) / y)*100
        this.setState({
            showOutputCard: true
        })
    }

    func(X) {

        var expr = compile(this.state.fx);
        let scope = {x:parseFloat(X)};
        return expr.eval(scope);        
    }

    funcDiff(X, degree) {

        var temp = this.state.fx, expr 
        for (var i=1 ; i<=degree ; i++) {
            temp = derivative(temp, 'x')
            expr = temp
        }
        
        let scope = {x:parseFloat(X)}
        return expr.eval(scope)
    }

    DataBase = async()=>{
        var response = await axios.get('http://localhost:3001/api/users/showDiff').then(res => {return res.data});
        this.setState({
            fx:response['data'][0]['fx'],
            degree:response['data'][0]['degree'],
            x:response['data'][0]['x'],
            h:response['data'][0]['h'],
        })
        this.central_2(parseInt(this.state.x), parseInt(this.state.h), parseInt(this.state.degree))
    }
	
    render() {
        return(
            <div style={{ background: "#FFFF", padding: "30px" ,  marginBlockStart: "2%"}}>
                <h2 style={{ color: "black", fontWeight: "bold" ,fontSize :"30px"}}>Central Divided-Differences O(h<sup>4</sup>)</h2>
                <Content 
                    onChange={this.handleChange}
                    style={{ 
                    width : "620px",
                    background: "#D2B48C",
                }}
                >

                        <Card
                            title={"Input Value"}
                            bordered={true}
                            style={{ background: "#D1D1D1" }}
                            onChange={this.handleChange}
                            id="inputCard"
                        >
                            <h2>f(x)</h2><Input size="large" name="fx" style={InputStyle}></Input>
                            <h2>Order Derivative</h2><Input size = "large" name="degree" style={InputStyle}></Input>
                            <h2>X</h2><Input size = "large" name="x" style={InputStyle}></Input><br/><br/>
                            <h2>H</h2><Input size="large" name="h" style={InputStyle}></Input><br/><br/>
                            <Button id="submit_button" onClick={

                                ()=>this.central_2(parseInt(this.state.x), parseInt(this.state.h), parseInt(this.state.degree))

                            }
                                style={{ 

                                    background: "#7DBCFB", 
                                    color: "black", 
                                    fontWeight: "bold",
                                    fontSize: "20px" }}>Submit

                                    </Button>

                            <Button id="submit_button" onClick={

                                ()=>this.DataBase()

                            }
                                style={{ 

                                    background: "#7DBCFB", 
                                    color: "black", 
                                    fontWeight: "bold",
                                    fontSize: "20px" }}>Database

                            </Button>

                        </Card>

                    {this.state.showOutputCard && 

                        <Card>
                            <p style={{fontSize: "24px", color : "black"  }}>
                                Approximate = {y}<br/>
                                Exact = {exact}<br/>
                                Error = {error}%
                            </p>
                        </Card>
                    } 
                </Content>
            </div>
        );
    }
}
export default Central_2