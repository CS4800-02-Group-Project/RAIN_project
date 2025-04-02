from typing import Dict, List, Optional
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from pydantic import BaseModel, Field

class ResearchEntry(BaseModel):
    """Represents a single research source with detailed metadata."""
    title: str = Field(description="Title of the research paper, book, or article.")
    authors: List[str] = Field(description="List of authors who contributed to the publication.")
    year: int = Field(description="Year of publication.")
    abstract: str = Field(description="A brief 2-3 sentence summary of the research paper.")
    source: str = Field(description="The journal, conference, or institution where the research was published.")
    doi_url: Optional[str] = Field(default=None, description="DOI link or official URL to the research paper (if available).")
    citations: Dict[str, str] = Field(default_factory=dict, description="Formatted citations in APA, MLA, IEEE, and Chicago styles.")

class ResearchReport(BaseModel):
    """Structured research report containing multiple research entries."""
    topic: str = Field(description="The overall research topic or field being investigated.")
    entries: List[ResearchEntry] = Field(description="A list of research entries, each containing detailed metadata about a source.")

@CrewBase
class Backend():
    """Backend crew for research gathering and structured reporting"""

    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    @agent
    def researcher(self) -> Agent:
        return Agent(
            config=self.agents_config['researcher'],
            verbose=True
        )

    @agent
    def reporting_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['reporting_analyst'],
            verbose=True
        )


    @task
    def research_task(self) -> Task:
        return Task(
            config=self.tasks_config['research_task'],
            agent=self.researcher(),
            output_json=ResearchEntry
        )

    @task
    def reporting_task(self) -> Task:
        return Task(
            config=self.tasks_config['reporting_task'],
            agent=self.reporting_analyst(),
            output_json=ResearchReport,  # Outputs the full structured research report
            output_file="report.json"
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Backend crew"""

        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,  # Automatically created by the @task decorator
            process=Process.sequential,  # Ensures the reporting happens after research
            verbose=True,
        )