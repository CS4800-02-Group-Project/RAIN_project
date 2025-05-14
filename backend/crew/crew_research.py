from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from pydantic import BaseModel
from crewai.tools import BaseTool
from datetime import datetime, timedelta
from serpapi import GoogleSearch
class ChatResponse(BaseModel):
    response: str

# Define a WebScrapingTool class
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
        organic_results = results["organic_results"]
        return organic_results



@CrewBase
class Backend():
    """CrewAutomationForAcademicResearchAndAnswers crew"""

    @agent
    def query_classifier(self) -> Agent:
        return Agent(
            config=self.agents_config['query_classifier'],
            tools=[],
        )

    @agent
    def senior_data_researcher(self) -> Agent:
        return Agent(
            config=self.agents_config['senior_data_researcher'],
            tools=[GoogleScholarScrapingTool()],
        )

    @agent
    def academic_helper(self) -> Agent:
        return Agent(
            config=self.agents_config['academic_helper'],
            tools=[],
        )

    @agent
    def reporting_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['reporting_analyst'],
            tools=[],
        )


    @task
    def classify_query(self) -> Task:
        return Task(
            config=self.tasks_config['classify_query'],
            tools=[],
        )

    @task
    def process_research_topic(self) -> Task:
        return Task(
            config=self.tasks_config['process_research_topic'],
            tools=[GoogleScholarScrapingTool()],
        )

    @task
    def process_academic_question(self) -> Task:
        return Task(
            config=self.tasks_config['process_academic_question'],
            tools=[],
        )

    @task
    def report_results(self) -> Task:
        return Task(
            config=self.tasks_config['report_results'],
            tools=[],
            output_json=ChatResponse
        )


    @crew
    def crew(self) -> Crew:
        """Creates the CrewAutomationForAcademicResearchAndAnswers crew"""
        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
        )
