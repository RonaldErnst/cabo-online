import { GetServerSideProps } from "next";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState } from "react";

interface FormValues {
  roomId: string;
  shouldCreateRoom: boolean;
}

const CreateJoinRoom = () => {
  const initialValues: FormValues = {
    roomId: "",
    shouldCreateRoom: false,
  };

  const validationSchema = Yup.object({
    roomId: Yup.string()
      .required("Required")
      .min(5, "Room name must be at least 5 characters long")
      .max(20, "Room name must be at most 20 characters long"),
  });

  async function handleSubmit(
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) {
    console.log(values);
    //actions.setFieldError();

    if (values.shouldCreateRoom) {
    } else {
    }

    actions.setSubmitting(false);
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ setFieldValue, handleSubmit, isSubmitting, errors }) => (
          <Form className="flex flex-col gap-4">
            {errors.roomId ? errors.roomId : ""}
            <Field
              id="roomId"
              name="roomId"
              placeholder="Join or create a new room..."
              className="w-72 h-12 p-2 rounded-md text-xl"
            />
            <div className="flex flex-row gap-10 justify-center text-lg">
              <button
                className="bg-orange-500 py-2 px-4 rounded-lg hover:bg-orange-400 disabled:bg-slate-5"
                disabled={isSubmitting}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  setFieldValue("shouldCreateRoom", true);
                  handleSubmit();
                }}
              >
                Create Room
              </button>
              <button
                className="bg-orange-500 py-2 px-4 rounded-lg hover:bg-orange-400 disabled:bg-slate-500"
                disabled={isSubmitting}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  setFieldValue("shouldCreateRoom", false);
                  handleSubmit();
                }}
              >
                Join Room
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      data: null,
    },
  };
};

export default CreateJoinRoom;
