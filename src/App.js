import logo from './logo.svg';
import './App.css';
import { useForm } from "react-hook-form";
import { useRecaptcha } from "react-hook-recaptcha";

const sitekey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
const containerId = "test-recaptcha";

function App() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    let outputMsg = "";
    Object.keys(data).forEach((key) => {
      outputMsg += `${key}: ${data[key]} \n`;
    });
    alert(outputMsg);
  };

  const successCallback = (response) =>
      handleSubmit((data) =>
          onSubmit({ ...data, catchaResponse: response }))();

  const { recaptchaLoaded, recaptchaWidget } = useRecaptcha({
    containerId,
    successCallback,
    sitekey,
    size: "invisible",
    theme: "dark"
  });

  const executeCaptcha = (e) => {
    e.preventDefault();
    if (recaptchaWidget !== null) {
      window.grecaptcha.reset(recaptchaWidget);
      window.grecaptcha.execute(recaptchaWidget);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          React feedback form with validation & captcha
        </p>
      </header>
      <div className="react-from">
        <form onSubmit={executeCaptcha}>
          <label htmlFor="name">Name</label>
          <input
              placeholder="Your name..."
              {...register("name", {
                required: true,
                validate: (value) => value.match(/^[a-zA-Z]+$/) !== null
              })}
          />
          {errors.name && <p>Only letters</p>}

          <label htmlFor="email">Email</label>
          <input
              placeholder="Your email..."
              type="email"
              {...register("email", {
                required: true
              })}
          />
          {errors.email && <p>This is required</p>}

          <label htmlFor="message">Message</label>
          <textarea
              placeholder="Some text..."
              {...register("message", {
                required: true,
                validate: {
                  lessThanHundred: (value) => value.length < 200
                }
              })}
          />
          {errors.message && errors.message.type === "lessThanHundred" && (
              <p>Your message should be less than 200 symbols</p>
          )}
          {errors.message && errors.message.type === "required" && <p>This is required</p>}


          <input type="submit" disabled={!recaptchaLoaded}/>
          <div id={containerId} />
        </form>
      </div>
    </div>
  );
}

export default App;
