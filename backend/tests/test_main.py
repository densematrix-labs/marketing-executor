import pytest
import json
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

def test_health(client):
    """Test health endpoint returns ok"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "marketing-executor"

def test_metrics(client):
    """Test metrics endpoint returns prometheus format"""
    response = client.get("/metrics")
    assert response.status_code == 200
    assert "text/plain" in response.headers.get("content-type", "")

@patch("app.main.call_llm")
def test_generate_success(mock_call_llm, client, mock_llm_response):
    """Test successful content generation"""
    mock_call_llm.return_value = json.dumps(mock_llm_response)
    
    response = client.post("/api/generate", json={
        "product_name": "TaskFlow AI",
        "description": "AI-powered task management for developers",
        "language": "en"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "twitter_posts" in data
    assert len(data["twitter_posts"]) == 5
    assert "linkedin_post" in data
    assert "reddit_post" in data
    assert "product_hunt" in data
    assert "email_templates" in data
    assert "launch_checklist" in data

@patch("app.main.call_llm")
def test_generate_with_optional_fields(mock_call_llm, client, mock_llm_response):
    """Test generation with all optional fields"""
    mock_call_llm.return_value = json.dumps(mock_llm_response)
    
    response = client.post("/api/generate", json={
        "product_name": "TaskFlow AI",
        "description": "AI-powered task management",
        "target_audience": "Developers and technical founders",
        "key_features": "AI prioritization\nSmart scheduling",
        "website_url": "https://taskflow.ai",
        "language": "zh"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "twitter_posts" in data

@patch("app.main.call_llm")
def test_generate_handles_json_in_markdown(mock_call_llm, client, mock_llm_response):
    """Test that API handles LLM response with markdown code blocks"""
    markdown_response = f"```json\n{json.dumps(mock_llm_response)}\n```"
    mock_call_llm.return_value = markdown_response
    
    response = client.post("/api/generate", json={
        "product_name": "Test",
        "description": "Test desc",
        "language": "en"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "twitter_posts" in data

def test_generate_missing_required_fields(client):
    """Test validation error for missing required fields"""
    response = client.post("/api/generate", json={
        "product_name": "Test"
        # missing description
    })
    
    assert response.status_code == 422

@patch("app.main.call_llm")
def test_generate_llm_error(mock_call_llm, client):
    """Test handling of LLM errors"""
    mock_call_llm.side_effect = Exception("LLM service unavailable")
    
    response = client.post("/api/generate", json={
        "product_name": "Test",
        "description": "Test desc",
        "language": "en"
    })
    
    assert response.status_code == 500
    data = response.json()
    assert "detail" in data
    # Ensure detail is a string, not an object
    assert isinstance(data["detail"], str)

@patch("app.main.call_llm")
def test_generate_invalid_json_response(mock_call_llm, client):
    """Test handling of invalid JSON from LLM"""
    mock_call_llm.return_value = "This is not JSON"
    
    response = client.post("/api/generate", json={
        "product_name": "Test",
        "description": "Test desc",
        "language": "en"
    })
    
    assert response.status_code == 500
    data = response.json()
    assert "detail" in data
    assert isinstance(data["detail"], str)

def test_error_detail_is_serializable(client):
    """Verify error responses have serializable detail field"""
    # Test 422 validation error
    response = client.post("/api/generate", json={})
    assert response.status_code == 422
    data = response.json()
    # FastAPI validation errors have 'detail' as array, which is fine
    # The key is it's not an unserializable object
    assert "detail" in data

@patch("app.main.call_llm")
def test_500_error_detail_format(mock_call_llm, client):
    """Verify 500 errors return string detail"""
    mock_call_llm.side_effect = Exception("Internal error")
    
    response = client.post("/api/generate", json={
        "product_name": "Test",
        "description": "Test",
        "language": "en"
    })
    
    assert response.status_code == 500
    data = response.json()
    detail = data.get("detail")
    assert isinstance(detail, str), f"500 error detail should be string: {detail}"
