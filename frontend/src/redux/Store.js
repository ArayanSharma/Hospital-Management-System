import { configureStore } from "@reduxjs/toolkit";
import departmentReducer from "./slices/DepartmentSlice"
import specialistReducer from "./slices/SpecialistSlice"

const Store = configureStore({

reducer:{
    departments:departmentReducer,
     specialists: specialistReducer,
}

});

export default Store;
