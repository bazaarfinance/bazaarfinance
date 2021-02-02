import * as React from "react";
import { useForm } from "react-hook-form";

type FormValues = { amount: number };

const DepositWithdrawModalForm = ({
  amount,
  setModalFormData
}: {
  amount: number;
  setModalFormData: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { register, reset, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      amount
    }
  });

  React.useEffect(() => {
    reset({
      amount
    });
  }, [reset, amount]);

  const onSubmit = (data: FormValues) => {
    setModalFormData(data.amount);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <h2>Deposit or Withdraw All</h2>
        <div>
            <label>Amount</label>
            <input
                name="amount"
                type="number"
                ref={register({
                    required: "An amount to deposit is required",
                    min: {
                        value: 1,
                        message: "A deposit of 1 or greater must made"
                    }
                })}
            />
        </div>
    <input type="submit" />
    </form>
  );
};

export { DepositWithdrawModalForm };
