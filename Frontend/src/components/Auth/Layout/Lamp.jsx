import "./../Styles/Lamp.css";

function Lamp({ isOn }) {

    return (

        <div className="lamp-wrapper">

            {isOn && (
                <div className="lamp-light"></div>
            )}

            <div className={`cute-lamp ${isOn ? "lamp-on" : "lamp-off"}`}>

                <div className="lamp-shade">

                    <div className="lamp-eyes">

                        <span className="eye"></span>

                        <span className="eye"></span>

                    </div>

                    {isOn && (
                        <div className="lamp-smile"></div>
                    )}

                </div>

                <div className="lamp-stand"></div>

                <div className="lamp-base"></div>

                <div className="pull-chain">

                    <div className="chain-line"></div>

                    <div className="chain-ball"></div>

                </div>

            </div>

        </div>

    );

}

export default Lamp;