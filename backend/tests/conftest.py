import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def mock_llm_response():
    return {
        "twitter_posts": [
            "Tweet 1 - Problem/Solution angle",
            "Tweet 2 - Feature highlight",
            "Tweet 3 - Social proof angle",
            "Tweet 4 - Comparison/Alternative angle",
            "Tweet 5 - Call to action"
        ],
        "linkedin_post": "Professional LinkedIn post content here...",
        "reddit_post": {
            "title": "I built X to solve Y problem",
            "body": "Hey everyone, I've been working on this project...",
            "best_subreddits": ["startups", "SaaS", "indiehackers"]
        },
        "product_hunt": {
            "tagline": "Launch faster with AI-generated marketing",
            "description": "Marketing Executor helps you launch...",
            "first_comment": "Hey PH! I'm the maker of this tool..."
        },
        "email_templates": [
            {
                "subject": "Quick question about X",
                "body": "Hi [Name],\n\nI noticed you're working on...",
                "angle": "Value proposition"
            },
            {
                "subject": "Partnership opportunity",
                "body": "Hi [Name],\n\nI came across your company...",
                "angle": "Partnership"
            },
            {
                "subject": "Story idea: New tool helps founders launch faster",
                "body": "Hi [Name],\n\nI wanted to share something...",
                "angle": "Press/Media"
            }
        ],
        "launch_checklist": [
            "Set up Product Hunt launch page",
            "Prepare Twitter thread",
            "Identify key subreddits to post in"
        ]
    }
