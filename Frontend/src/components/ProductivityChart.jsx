import "../styles/ProductivityChart.css";

function ProductivityChart(){

    return(

        <div className="productivity-chart">

            <h2>Weekly Productivity</h2>

            <div className="chart-bars">

                <div className="bar h1"></div>
                <div className="bar h2"></div>
                <div className="bar h3"></div>
                <div className="bar h4"></div>
                <div className="bar h5"></div>
                <div className="bar h6"></div>
                <div className="bar h7"></div>

            </div>

        </div>

    );

}

export default ProductivityChart;