import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { DepositWithdrawModalForm } from "./DepositWithdrawModalForm";
import "./styles.css";

type FormValues = {
  toggle: boolean;
  amount: number;
  ghost: string;
  keepValue: string;
};

export default function DepositWithdraw() {
  const [modalFormData, setModalFormData] = React.useState(0);
  const { watch, register, setValue, getValues, handleSubmit } = useForm<
    FormValues
  >();
  const [showModal, setShowModal] = React.useState(false);
  const { toggle, amount } = watch();

  React.useEffect(() => {
    // customm register input will not be impatced by unmount
    register("ghost", { required: true });
  }, [register]);

  React.useEffect(() => {
    setValue("amount", modalFormData);
  }, [setValue, modalFormData]);

  const onSubmit: SubmitHandler<FormValues> = data => {
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="checkbox" name="toggle" ref={register} />
        {toggle && (
          <button type="button" onClick={() => setShowModal(!showModal)}>
            Show Modal
          </button>
        )}

        <input
          disabled={!toggle}
          name="amount"
          placeholder="0"
          ref={register}
        />

        <input
          name="keepValue"
          placeholder="keepValue"
          ref={register}
          style={{
            display: toggle ? "block" : "none" // toggle the visbility of an input
          }}
        />

        {toggle && (
          <input
            placeholder="ghost"
            onChange={e => {
              setValue("ghost", e.target.value, {shouldValidate: true, shouldDirty: true });
            }}
            defaultValue={getValues("ghost")}
          />
        )}

        <input type="submit" />
      </form>

      {/* working with a modal pop up */}
      {showModal && (
        <DepositWithdrawModalForm amount={amount} setModalFormData={setModalFormData} />
      )}
    </>
  );
}
