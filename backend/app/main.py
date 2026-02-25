"""AI Marketing Executor - FastAPI Backend"""
import os
import json
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from fastapi.responses import Response

app = FastAPI(title="AI Marketing Executor", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus metrics
TOOL_NAME = "marketing-executor"
http_requests = Counter("http_requests_total", "HTTP requests", ["tool", "endpoint", "method", "status"])
generation_count = Counter("generation_count_total", "Content generations", ["tool", "content_type"])
generation_duration = Histogram("generation_duration_seconds", "Generation duration", ["tool"])

# LLM Proxy config
LLM_PROXY_URL = os.getenv("LLM_PROXY_URL", "https://llm-proxy.densematrix.ai")
LLM_PROXY_KEY = os.getenv("LLM_PROXY_KEY", "")

class ProductInput(BaseModel):
    product_name: str
    description: str
    target_audience: Optional[str] = None
    key_features: Optional[str] = None
    website_url: Optional[str] = None
    language: str = "en"

class MarketingContent(BaseModel):
    twitter_posts: list[str]
    linkedin_post: str
    reddit_post: dict
    product_hunt: dict
    email_templates: list[dict]
    launch_checklist: list[str]

async def call_llm(prompt: str, system_prompt: str = "") -> str:
    """Call LLM proxy for content generation"""
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"{LLM_PROXY_URL}/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {LLM_PROXY_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "claude-sonnet-4-20250514",
                "messages": [
                    {"role": "system", "content": system_prompt} if system_prompt else None,
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 4000
            }
        )
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"LLM error: {response.text}")
        data = response.json()
        return data["choices"][0]["message"]["content"]

@app.get("/health")
async def health():
    return {"status": "ok", "service": "marketing-executor"}

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.post("/api/generate", response_model=MarketingContent)
async def generate_marketing_content(input: ProductInput):
    """Generate marketing content for all platforms"""
    import time
    start = time.time()
    
    system_prompt = """You are an expert startup marketing copywriter. 
Generate compelling, authentic marketing content that technical founders can immediately use.
Avoid corporate buzzwords. Be specific, benefit-focused, and genuine.
Output valid JSON only, no markdown."""

    language_note = "Generate content in Chinese (简体中文)" if input.language == "zh" else "Generate content in English"
    
    prompt = f"""Generate marketing content for this product:

**Product Name:** {input.product_name}
**Description:** {input.description}
**Target Audience:** {input.target_audience or 'Tech founders, developers, indie hackers'}
**Key Features:** {input.key_features or 'See description'}
**Website:** {input.website_url or 'N/A'}

{language_note}

Output this exact JSON structure:
{{
  "twitter_posts": [
    "Tweet 1 - Problem/Solution angle (max 280 chars)",
    "Tweet 2 - Feature highlight (max 280 chars)",
    "Tweet 3 - Social proof angle (max 280 chars)",
    "Tweet 4 - Comparison/Alternative angle (max 280 chars)",
    "Tweet 5 - Call to action (max 280 chars)"
  ],
  "linkedin_post": "Professional LinkedIn post (300-500 words, include hashtags)",
  "reddit_post": {{
    "title": "Reddit post title",
    "body": "Reddit post body (authentic, not salesy)",
    "best_subreddits": ["subreddit1", "subreddit2", "subreddit3"]
  }},
  "product_hunt": {{
    "tagline": "One-line tagline (max 60 chars)",
    "description": "Product Hunt description (200-300 words)",
    "first_comment": "Maker's first comment"
  }},
  "email_templates": [
    {{
      "subject": "Email subject line",
      "body": "Email body for cold outreach to potential users",
      "angle": "Value proposition"
    }},
    {{
      "subject": "Email subject line",
      "body": "Email body for partnership outreach",
      "angle": "Partnership"
    }},
    {{
      "subject": "Email subject line", 
      "body": "Email body for press/media",
      "angle": "Press/Media"
    }}
  ],
  "launch_checklist": [
    "Pre-launch task 1",
    "Launch day task 1",
    "Post-launch task 1"
  ]
}}"""

    try:
        response_text = await call_llm(prompt, system_prompt)
        # Clean response - extract JSON
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0]
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0]
        
        content = json.loads(response_text.strip())
        
        # Record metrics
        generation_count.labels(tool=TOOL_NAME, content_type="full").inc()
        generation_duration.labels(tool=TOOL_NAME).observe(time.time() - start)
        
        return MarketingContent(**content)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse LLM response: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
