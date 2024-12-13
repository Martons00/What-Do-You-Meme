import { useEffect } from "react";
import PropTypes from "prop-types";
import "./CSS/TimerBar.css";

const TimerBar = (props) => {
	const filled = props.filled;
	const setFilled = props.setFilled;
	useEffect(() => {
		if (filled < props.durationInSeconds * 10 && props.isRunning) {
			setTimeout(() => setFilled(prev => prev = (prev + 1)), 100)
		} else if (filled == props.durationInSeconds * 10) {
			props.setIsRunning(false);
		}
	}, [filled, props.isRunning])
	return (
		<div className="BoxProgressBar">
			<div className="progressbar">
				<div style={{
					height: "100%",
					width: `${filled / props.durationInSeconds * 10}%`,
					backgroundColor: "#6600ff",
					transition: "width 0.1s"
				}}></div>
				<span className="progressPercent">{filled / 10} sec </span>
			</div>
		</div>
	)
}


TimerBar.propTypes = {
	setIsRunning: PropTypes.func,
	durationInSeconds: PropTypes.number,
	isRunning: PropTypes.bool,
	filled: PropTypes.number,
	setFilled: PropTypes.func
}
export default TimerBar;