import React, { useState } from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';

function App() {
  const [avatarURL, setAvatarURL] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [repoData, setRepoData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const fetchUserData = async (username) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const result = await response.json();
      setAvatarURL(result.avatar_url);
      setUserInfo(result);
    } catch (error) {
      console.error(error);
    }
  };

  const repoDataURL = async (username) => {
    try {
      let allRepos = [];
      let pageNum = 1;
      let repos = [];

      do {
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?page=${pageNum}&per_page=100&sort=updated`
        );
        repos = await response.json();
        allRepos = [...allRepos, ...repos];
        pageNum++;
      } while (repos.length === 100);

      setRepoData(allRepos);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (githubUsername) {
      repoDataURL(githubUsername);
      fetchUserData(githubUsername);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center mb-4">
        <Col md={4}>
          <InputGroup className="mb-3">
            <Form onSubmit={handleSubmit} className="w-100">
              <Form.Control
                placeholder="Enter GitHub Username"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                className="mb-2 rounded-pill"
              />
              <Button type="submit" variant="primary" className="w-100 rounded-pill">
                Search User
              </Button>
            </Form>
          </InputGroup>
        </Col>
      </Row>

      {userInfo && (
        <Row className="justify-content-center mb-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center">
                  <img
                    src={avatarURL}
                    alt={githubUsername}
                    className="rounded-circle"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                  <div className="ms-3">
                    <h4 className="mb-0">{userInfo.name || githubUsername}</h4>
                    <p className="text-muted mb-2">@{githubUsername}</p>
                    <p className="mb-2 small">{userInfo.bio}</p>
                  </div>
                </div>

                <div className="d-flex justify-content-around mt-3 pt-3 border-top">
                  <div className="text-center">
                    <h6 className="mb-0">{userInfo.followers}</h6>
                    <small className="text-muted">Followers</small>
                  </div>
                  <div className="text-center">
                    <h6 className="mb-0">{userInfo.following}</h6>
                    <small className="text-muted">Following</small>
                  </div>
                  <div className="text-center">
                    <h6 className="mb-0">{userInfo.public_repos}</h6>
                    <small className="text-muted">Repos</small>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-3 justify-content-center">
                  {userInfo.location && (
                    <Badge bg="light" text="dark" className="px-3 py-2">
                      <i className="bi bi-geo-alt me-1"></i>
                      {userInfo.location}
                    </Badge>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row className="justify-content-center">
        <Col md={10}>
          <h4 className="mb-3">Repositories</h4>
          <Row xs={1} md={2} lg={3} className="g-4">
            {repoData.map((repo) => (
              <Col key={repo.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>{repo.name}</Card.Title>
                    <Card.Text className="text-muted">{repo.description}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge bg="info">{repo.language}</Badge>
                      <div>
                        <Badge bg="success" className="me-1">
                          <i className="bi bi-star"></i> {repo.stargazers_count}
                        </Badge>
                        <Badge bg="secondary">
                          <i className="bi bi-diagram-2"></i> {repo.forks_count}
                        </Badge>
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      Updated: {new Date(repo.updated_at).toLocaleDateString()}
                    </small>
                    <Button
                      href={repo.html_url}
                      target="_blank"
                      variant="outline-primary"
                      size="sm"
                      className="float-end"
                    >
                      View
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
