from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from pydantic import BaseModel
from crewai.tools import BaseTool
from serpapi import GoogleSearch

class ChatResponse(BaseModel):
    response: str

class GoogleScholarScrapingTool(BaseTool):
    name: str = "GoogleScholarScrapingTool"
    description: str = "A tool using SerpiAPI to scrape Google Scholar for research papers and articles."
    
    def _run(self, query: str) -> list:
        params = {
            "engine": "google_scholar",
            "q": query,
            "api_key": "3e667b2154bfb7818917f8c17e9abc107006d9626a1478d8289a95e3ec23460c"
        }
        search = GoogleSearch(params)
        results = search.get_dict()
        return results["organic_results"]

@CrewBase
class ResearchCrew():
    """Research crew for academic research and analysis"""

    @agent
    def senior_data_researcher(self) -> Agent:
        return Agent(
            role="Senior Data Researcher",
            goal="Use GoogleScholarScrapingTool to extract factual paper information on the research topic: {query}",
            backstory="An experienced academic data researcher who strictly reports only what is returned from GoogleScholarScrapingTool",
            verbose=True,
            tools=[GoogleScholarScrapingTool()]
        )

    @agent
    def reporting_analyst(self) -> Agent:
        return Agent(
            role="Reporting Analyst",
            goal="Format and present research findings",
            backstory="A formatting specialist responsible for packaging the final output",
            verbose=True
        )

    @task
    def process_research_topic(self) -> Task:
        return Task(
            description="Research the topic {query} using GoogleScholarScrapingTool and extract relevant papers",
            expected_output="A Markdown-formatted list with paper details, such as title, authors, year, abstract and link. If any field is missing, use N/A. Do not fabricate information. ",
            agent=self.senior_data_researcher()
        )

    @task
    def report_results(self) -> Task:
        return Task(
            description="Format and present the research findings",
            expected_output="Final formatted response",
            agent=self.reporting_analyst(),
            output_json=ChatResponse
        )

    @crew
    def crew(self) -> Crew:
        """Creates the research crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True
        )