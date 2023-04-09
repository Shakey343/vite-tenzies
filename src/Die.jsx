import React from "react"
import Dot from "./Dot"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    const dots = new Array(props.value)

    return (
        <div
            className={`die-face face${props.value}`}
            style={styles}
            onClick={props.holdDice}
        >
            {dots.fill().map((dot, i) => <Dot key={i} />)}
        </div>
    )
}
