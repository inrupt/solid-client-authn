import React, { Component } from "react";
import "regenerator-runtime/runtime";

import fetcher, {
  login,
  getSession,
  handleRedirect,
  logout,
  fetch
} from "../../../../../dist/index";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "loading",
      loginIssuer: "http://localhost:8080/",
      fetchRoute: "http://localhost:10100/",
      fetchBody: "",
      session: null
    };
    if (window.location.pathname === "/popup") {
      this.state.status = "popup";
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleFetch = this.handleFetch.bind(this);
  }

  async componentDidMount() {
    const session = await getSession();
    if (window.location.pathname === "/popup") {
      this.state.status = "popup";
      setTimeout(() => window.close(), 2000);
    } else if (!session) {
      const authCode = new URL(window.location.href).searchParams.get("code");
      if (!authCode) {
        this.setState({ status: "login" });
      }
    } else {
      this.setState({ status: "dashboard", session });
    }
  }

  async handleLogin(e, isPopup = false) {
    e.preventDefault();
    this.setState({ status: "loading" });
    const session = await login({
      clientId: "coolApp",
      redirect: "http://localhost:3001/",
      oidcIssuer: this.state.loginIssuer,
      popUp: isPopup,
      popUpRedirectPath: "/popup"
    });
    if (
      session.neededAction &&
      session.neededAction.actionType === "redirect"
    ) {
      window.location.href = session.neededAction.redirectUrl;
    } else if (session) {
      this.setState({ status: "dashboard", session });
    }
  }

  async handleLogout(e) {
    e.preventDefault();
    this.setState({ status: "loading" });
    await logout();
    this.setState({
      status: "login",
      fetchBody: "",
      session: null
    });
  }

  async handleFetch(e) {
    e.preventDefault();
    this.setState({ status: "loading", fetchBody: "" });
    const response = await (await fetch(this.state.fetchRoute, {})).text();
    this.setState({ status: "dashboard", fetchBody: response });
  }

  render() {
    switch (this.state.status) {
      case "popup":
        return <h1>Popup Redirected</h1>;
      case "loading":
        return <h1>Loading</h1>;
      case "login":
        return (
          <form>
            <h1>Solid Auth Fetcher Demo Login</h1>
            <input
              type="text"
              value={this.state.loginIssuer}
              onChange={e => this.setState({ loginIssuer: e.target.value })}
            />
            <button onClick={this.handleLogin}>Log In</button>
            <button onClick={e => this.handleLogin(e, true)}>
              Log In with Popup
            </button>
          </form>
        );
      case "dashboard":
        return (
          <div>
            <h1>Solid Auth Fetcher Demo Dashboad</h1>
            <p>WebId: {this.state.session.webId}</p>
            <form>
              <input
                type="text"
                value={this.state.fetchRoute}
                onChange={e => this.setState({ fetchRoute: e.target.value })}
              />
              <button onClick={this.handleFetch}>Fetch</button>
              <pre>{this.state.fetchBody}</pre>
            </form>
            <form>
              <button onClick={this.handleLogout}>Log Out</button>
            </form>
          </div>
        );
    }
  }
}

export default Form;
