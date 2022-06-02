import { Chip, FormControl, Input, makeStyles } from "@material-ui/core";
import { InputLabel } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { isNamedExportBindings } from "typescript";

type Props = {
  tagList: any;
  setTagList: React.Dispatch<React.SetStateAction<any>>;
};

export default function TagInput(props: Props) {
  const classes = useStyles();
//   const [values, setValues] = useState([{name:"test"}]);
  const [currValue, setCurrValue] = useState("");

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      props.setTagList((oldState: any) => [
        ...oldState,
        { name: e.currentTarget.value , color : 'red' },
      ]);
      setCurrValue("");
    }
  };

  useEffect(() => {
    console.log(props.tagList);
  }, [props.tagList]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCurrValue(e.target.value);
  };

  const handleDelete = (item: any, index: number): void => {
    let arr = [...props.tagList];
    arr.splice(index, 1);
    console.log(item);
    props.setTagList(arr);
  };

  //   const handleColor = (item: any, index: number): void => {
  //     let arr = [...props.tagList];
  //     arr.splice(index, 1);
  //     console.log(item);
  //     props.setTagList(arr);
  //   };

  return (
    <>
      <FormControl classes={{ root: classes.formControlRoot }}>
        <div className={"container"}>
          <InputLabel sx={{ padding: "0 5px" }}>Tags</InputLabel>
          {props.tagList.map((item: any, index: number) => (
            <Chip
              onDelete={() => handleDelete(item, index)}
              //   onClick={()=>handleColor(item , index)}
              label={item.name}
            />
          ))}
        </div>
        <Input
          value={currValue}
          onChange={handleChange}
          onKeyDown={handleKeyUp}
        />
      </FormControl>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  formControlRoot: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
    border: "1px solid lightgray",
    padding: "5px",
    borderRadius: "4px",
    marginTop: "16px",
    marginBottom: "8px",
    "&> div.container": {
      gap: "6px",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
    },
    "& > div.container > span": {
      backgroundColor: "gray",
      padding: "1px 3px",
      borderRadius: "4px",
    },
  },
}));
