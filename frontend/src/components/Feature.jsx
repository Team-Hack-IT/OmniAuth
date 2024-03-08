import image1 from "../assets/image1.svg";
import image2 from "../assets/image2.svg";
import image3 from "../assets/image3.svg";
import image4 from "../assets/image4.svg";
import image5 from "../assets/image5.svg";

const Feature = () => {
  return (
    <section className=" flex flex-col justify-center items-center gap-10">
      <h2 className="pt-10 text-4xl text-primary font-bold tracking-medium">
        What We Offer
      </h2>
      <p className="text-tertiary">
        We provide comprehensive identity management solution to users
      </p>
      <div className="flex justify-center items-center gap-60">
        <div className="flex flex-col ">
          <h3 className="text-3xl font-semibold text-primary w-60">
            Secure User Authentication
          </h3>
          <p className="w-[350px]">
            User Authentication ensures user identity verification.
          </p>
        </div>
        <div className="flex w-[]">
          <img src={image1} width={300} height={300} />
        </div>
      </div>

      <div className="flex justify-center items-center gap-60">
        <div className="">
          <img src={image2} width={300} height={300} />{" "}
        </div>
        <div className="flex flex-col">
          <h3 className="text-3xl font-semibold text-primary w-60">Phone Number Verification</h3>
          <p className="w-[350px]">
            Verifying phone number reduces the risk of fraudulent activities.
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center gap-60">
        <div className="flex flex-col">
          <h3 className="text-3xl font-semibold text-primary w-60">ID Verification</h3>
          <p className="w-[350px]">
            Compares the identity of a person claims to possess with date that
            proves it.
          </p>
        </div>
        <div className="">
          <img src={image3} width={300} height={300} />{" "}
        </div>
      </div>

      <div className="flex justify-center items-center gap-60">
        <div className="">
          <img src={image4} width={300} height={300} />{" "}
        </div>
        <div className="flex flex-col">
          <h3 className="text-3xl font-semibold text-primary w-60">Unique ID Generation</h3>
          <p className="w-[350px]">
            Generate a unique ID for each user after successful authentication.
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center gap-60">
        <div className="flex flex-col">
          <h3 className="text-3xl font-semibold text-primary w-60">User-Friendly Dashboard</h3>
          <p className="w-[350px]">
            Provide users with a dashboard to monitor the usage of their unique
            IDs, view records, and manage their identity-related information.
          </p>
        </div>
        <div className="">
          <img src={image5} width={300} height={300} />{" "}
        </div>
      </div>
    </section>
  );
};

export default Feature;
