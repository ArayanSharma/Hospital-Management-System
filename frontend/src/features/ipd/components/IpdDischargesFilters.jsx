import React, { useEffect } from "react";
import IpdFiltersBar from "./IpdFiltersBar.jsx";

export default function IpdDischargesFilters(props) {
  useEffect(() => {
    if (props.setStatus && props.status !== "discharged") {
      props.setStatus("discharged");
    }
  }, []);

  return <IpdFiltersBar {...props} dateLabel="Discharge Date" />;
}
