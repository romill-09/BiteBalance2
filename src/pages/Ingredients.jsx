import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Upload from "../components/Upload";
import Parameters from "../components/Parameters";
import Recipe from "../components/Recipe";
import Modal from "@mui/material/Modal";
import { Hourglass } from "react-loader-spinner";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: 'transparent',
  p: 2,
  pl: 20,
};

const steps = ["Take a Photo", "Choose your Preferences", "Get the Recipes"];

export default function Ingredients() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [ing, setIng] = React.useState();
  const [skipped, setSkipped] = React.useState(new Set());
  const [recipe, setRecipe] = React.useState();

  const isStepOptional = (step) => {
    return false;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Hourglass
            visible={true}
            height="80"
            width="80"
            ariaLabel="hourglass-loading"
            wrapperStyle={{}}
            wrapperClass=""
            colors={["#306cce", "#72a1ed"]}
          />
        </Box>
      </Modal>
      <Box sx={{ width: '95%', pt:10, margin:"auto" }}>
        <Stepper activeStep={activeStep}
          sx={{ '& .MuiStepLabel-label': { fontSize: '2.7vmin' }, '& .MuiStepIcon-root': { fontSize: '2.7vmin' } }}
        >
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === 0 && (
          <div>
            <Upload setIng={setIng} handleNext={handleNext} setOpen={setOpen} />
          </div>
        )}
        {activeStep === 1 && (
          <div>
            <Parameters
              ing={ing}
              handleNext={handleNext}
              setRecipe={setRecipe}
              setOpen={setOpen}
            />
          </div>
        )}
        {activeStep === 2 && (
          <div>
            <Recipe recipe={recipe} handleNext={handleNext} setOpen={setOpen} />
          </div>
        )}
      </Box>
    </>
  );
}
