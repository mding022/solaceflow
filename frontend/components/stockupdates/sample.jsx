import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion

const ChartComponent = props => {
    const {
        data,
        ticker, // Get ticker from props
        colors: {
            backgroundColor = 'black',
            lineColor = '#2962FF',
            textColor = 'white',
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
            gridColor = '#111',
        } = {},
    } = props;

    const chartContainerRef = useRef(null);
    const [chartData, setChartData] = useState(data);
    const [isDataValid, setIsDataValid] = useState(true); // Track if the data is valid

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            grid: {
                vertLines: { color: gridColor },
                horzLines: { color: gridColor },
            },
        });

        chart.timeScale().fitContent();
        const newSeries = chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
        newSeries.setData(chartData);

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ 
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [chartData, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor, gridColor, chartContainerRef]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/recent?ticker=${ticker}`);
                const data = await response.json();

                // If the data is not an array, fall back to initialData
                if (Array.isArray(data)) {
                    const newData = data.map((value, index) => ({
                        time: `2018-12-${10 + index}`,  // Adjust the date formatting as needed
                        value: parseFloat(value),  // Ensure the value is parsed to a number
                    }));
                    setChartData(newData);
                    setIsDataValid(true); // Set valid data state
                } else {
                    setChartData(initialData); // Fallback to initialData if the data is not in expected format
                    setIsDataValid(false); // Set invalid data state
                }
            } catch {
                setChartData(initialData); // Fallback to initialData in case of an error
                setIsDataValid(false); // Set invalid data state
            }
        };

        if (ticker) {
            fetchData(); // Fetch data when ticker is set
        }

        const intervalId = setInterval(fetchData, 500);
        return () => clearInterval(intervalId);
    }, [ticker]); // Depend on ticker

    return (
        <div style={{ position: 'relative', width: '100%', height: '60vh' }}>
            <motion.div
                ref={chartContainerRef}
                style={{ width: '100%', height: '100%', position: 'absolute' }}
                initial={{ opacity: 0, scale: 1 , y:0}} // Start with opacity 0 and scale 0 if no data
                animate={{ opacity: isDataValid ? 1 : 0, y: isDataValid ? 0 : 48 }} // Fade in and slide in when data is valid
                transition={{ duration: 0.5 }} // Smooth transition for opacity and scale
            >
                <div ref={chartContainerRef} />
            </motion.div>
            {!isDataValid && (
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        fontSize: '64px',
                        fontWeight: 'normal',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    No data found.
                </motion.div>
            )}
        </div>
    );
};

const initialData = [
    { time: '2018-12-01', value: 0 },
    { time: '2018-12-02', value: 0 },
    { time: '2018-12-03', value: 0 },
    { time: '2018-12-04', value: 0 },
    { time: '2018-12-05', value: 0 },
    { time: '2018-12-06', value: 0 },
    { time: '2018-12-07', value: 0 },
    { time: '2018-12-08', value: 0 },
    { time: '2018-12-09', value: 0 },
    { time: '2018-12-10', value: 0 },
];

export default function App(props) {
    return <ChartComponent {...props} data={initialData} ticker={props.ticker} />;
}
