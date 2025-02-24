import FollowUpPage from "@/components/FollowUpPage";
import SignupPage from "@/components/SignupPage";
import { useState } from "react";


interface UserData {
  name:string;
  email: string;
  password: string;
  role:string;
}

function SignUp() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>();

  const handleSignUpComplete = (data: UserData) => {
    setUserData(data);
    setStep(2);
  };

  return (
    <div>
      {step === 1 ? (
        <SignupPage onSignUpComplete={handleSignUpComplete} />
      ) : (
        <FollowUpPage userData={userData} />
      )}
    </div>
  );
}

export default SignUp;
