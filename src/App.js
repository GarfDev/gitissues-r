import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Markdown from "markdown-to-jsx";
import RepoPage from "./components/RepoPage"; 
import MainSideBar from "./components/MainSideBar";
import IssuesPage from "./components/IssuesPage";

import "./App.css";

const clientId = "57091af873a54cbc4d71";

function App() {
  const [allIssues, setAllIssues] = useState([]);
  const [issues, setIssues] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showIssues, setShowIssues] = useState(true);
  const [repo, setRepo] = useState([]);
  const [totalSearchResult, setTotalSearchResult] = useState(0);
  const [issueName, setIssueName] = useState('react-native-community/react-native-navbar');


  const getIssues = async () => {
    const url = `https://api.github.com/repos/${issueName}/issues`;
    const result = await fetch(url);
    const data = await result.json();
    console.log(data)
    setIssues(data);
    setAllIssues(data);
    
    // console.log(searchInput);
  };

  const search = async page => {
    const url = `https://api.github.com/search/repositories?q=${searchInput}&page=${page}`;
    console.log(url);
    const result = await fetch(url);
    const data = await result.json();
    setTotalSearchResult(Math.round(data.total_count/30));
    setRepo(data.items);
    setShowIssues(false); 
  };

  const handleChange = input => {
    setSearchInput(input);
  };


  const findOnPage = term => {
    // console.log(term);
    if (term === "") {
      setIssues(allIssues);
    } else {
      const filteredIssues = issues.filter(issue => {
        if (issue.title.toLowerCase().includes(term.toLowerCase())) {
          return true;
        }
        return false;
      });
      setIssues(filteredIssues);
    }
  };

  useEffect(() => {
    getIssues();
  }, [issueName]);

  useEffect(() => {
    const existingToken = sessionStorage.getItem("token");
    const accessToken =
      window.location.search.split("=")[0] === "?access_token"
        ? window.location.search.split("=")[1]
        : null;

    if (!accessToken && !existingToken) {
      window.location.replace(
        `https://github.com/login/oauth/authorize?scope=user:email,repo&client_id=${clientId}`
      );
    }

    if (accessToken) {
      // console.log(`New accessToken: ${accessToken}`);

      sessionStorage.setItem("token", accessToken);
      // this.state = {
      //   token: accessToken
      // };
    }

    if (existingToken) {
      // this.state = {
      //   token: existingToken
      // };
    }
  });
  return (
    <div className="App">
      <MainSideBar />

      <Container>
        <Row>
          <div className="inputContainer m-3">
            <input
              name="search"
              type="text"
              onChange={event => handleChange(event.target.value)}
              className="form-control input-lg"
              placeholder="Search Issue..."
            />
            <Button onClick={() => search()}>Search</Button>
          </div>
          <Col>
            <Row>
              {showIssues ? (
                <IssuesPage issues={issues} />
              ) : (
                <RepoPage
                  search={search}
                  repo={repo}
                  totalSearchResult={totalSearchResult}
                  setTotalSearchResult={setTotalSearchResult}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  setIssueName={setIssueName}
                  setShowIssues={setShowIssues}
                />
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;

{
  /* <input
                name="search"
                width="30px"
                type="text"
                id="findOnPage"
                onChange={event => findOnPage(event.target.value)}
                className="form-control input-lg"
                placeholder="Find on page..."
              /> */
}
