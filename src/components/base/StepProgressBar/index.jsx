import React from 'react'
import { ProgressBar, Step } from 'react-step-progress-bar'

const StepProgressBar = (_props) => {
  return (
    <ProgressBar {..._props} filledBackground="linear-gradient(to right, #DFF9E6, #23C55E)">
      {_props.stepPositions.map(() => (
        <Step transition="scale">
          {({ accomplished }) => (
            <div
              className={`h-4 w-4 ${accomplished ? 'bg-green-700' : 'bg-gray-200'} rounded-full`}
              accomplished={accomplished}
            ></div>
          )}
        </Step>
      ))}
    </ProgressBar>
  )
}

export default StepProgressBar
