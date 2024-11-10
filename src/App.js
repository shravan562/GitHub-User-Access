import { useState } from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function App() {
  const [avatarURL, setAvatarURL] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [repoData, setRepoData] = useState([]);

  const repoDataURL = async (username) => {
    try {
      let allRepos = [];
      let pageNum = 1;
      let repos = [];

      // Fetch repositories until there are no more pages
      do {
        const response = await fetch(`https://api.github.com/users/${username}/repos?page=${pageNum}&per_page=100`);
        repos = await response.json();
        allRepos = [...allRepos, ...repos];
        pageNum++;
      } while (repos.length === 100);

      // Map repositories to JSX elements
      const list = allRepos.map((item) => (
        <div className="text-center" key={item.id}>
          <a target="_blank" rel="noopener noreferrer" href={item.html_url}>
            {item.name}
          </a>
        </div>
      ));

      setRepoData(list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (githubUsername) {
      repoDataURL(githubUsername);
      fetchAvatarURL(githubUsername);
    }
  };

  const fetchAvatarURL = async (username) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const result = await response.json();
      setAvatarURL(result.avatar_url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App w-100 min-vh-100 justify-content-center align-items-center d-flex flex-column">
      <InputGroup className="mb-3 username-search-bar">
        <Form onSubmit={handleSubmit}>
          <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
          <Form.Control
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
          />
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </Form>
      </InputGroup>
      <Card style={{ width: '18rem' }}>
        {avatarURL && <Card.Img variant="top" src={avatarURL} />}
        <Card.Body>
          <Card.Title>{githubUsername}</Card.Title>
        </Card.Body>
      </Card>
      <div className="repo-list">
        {repoData}
      </div>
    </div>
  );
}

export default App;
