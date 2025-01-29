import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useFormik, Formik, Form, Field } from "formik";
import yup from "yup";
import { signupValidation } from "./signupValidation";
import axios from "axios";

const initialValues = {
  name: "",
  email: "",
  password: "",
  cpassword: "",
};

function App() {
  const handleSubmit = async (values, actions) => {
    console.log("Form Submitted:");
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      cpassword: values.cpassword,
    };
    axios
      .post("http://localhost:3001/", payload)
      .then((res) => {
        console.log(res);
        prompt("Uploaded successfully", JSON.stringify(res));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      <Formik
        initialValues={initialValues}
        validationSchema={signupValidation}
        onSubmit={handleSubmit}
      >
        {({ errors }) => (
          <Form>
            <label htmlFor="name">Name</label>
            <br />
            <Field type="text" name="name"></Field>
            <br />
            {errors.name && <small>{errors.name}</small>}
            <br />
            <label htmlFor="email">Email</label>
            <br />
            <Field type="email" name="email"></Field>
            <br />
            {errors.email && <small>{errors.email}</small>}
            <br />
            <label htmlFor="password">Password</label>
            <br />
            <Field type="password" name="password"></Field>
            <br />
            {errors.password && <small>{errors.password}</small>}
            <br />
            <label htmlFor="cpassword">Confirm Password</label>
            <br />
            <Field type="password" name="cpassword"></Field>
            <br />
            {errors.cpassword && <small>{errors.cpassword}</small>}
            <br />
            <button type="submit">submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default App;
