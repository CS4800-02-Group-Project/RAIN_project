from typing import Dict, List, Optional
import yaml
import os
from crewai import Agent, Crew, Process, Task
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI

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

class Backend():
    """Backend crew for research gathering and structured reporting"""

    def __init__(self):
        # Get the directory of the current file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        config_dir = os.path.join(current_dir, 'config')
        
        # Load YAML configurations
        with open(os.path.join(config_dir, 'agents.yaml'), 'r') as file:
            self.agents_config = yaml.safe_load(file)
        
        with open(os.path.join(config_dir, 'tasks.yaml'), 'r') as file:
            self.tasks_config = yaml.safe_load(file)

        # Initialize OpenAI
        self.llm = ChatOpenAI(
            model="gpt-4-turbo-preview",
            temperature=0.7
        )

    def researcher(self) -> Agent:
        config = self.agents_config['researcher']
        return Agent(
            role=config['role'].strip(),
            goal=config['goal'].strip(),
            backstory=config['backstory'].strip(),
            llm=self.llm,
            verbose=True
        )

    def reporting_analyst(self) -> Agent:
        config = self.agents_config['reporting_analyst']
        return Agent(
            role=config['role'].strip(),
            goal=config['goal'].strip(),
            backstory=config['backstory'].strip(),
            llm=self.llm,
            verbose=True
        )

    def research_task(self) -> Task:
        config = self.tasks_config['research_task']
        return Task(
            description=config['description'].strip(),
            agent=self.researcher(),
            expected_output=config['expected_output'].strip(),
            output_json=ResearchEntry
        )

    def reporting_task(self) -> Task:
        config = self.tasks_config['reporting_task']
        return Task(
            description=config['description'].strip(),
            agent=self.reporting_analyst(),
            expected_output=config['expected_output'].strip(),
            output_json=ResearchReport,
            output_file=config.get('output_file', 'report.json'),
            context=[self.research_task()]
        )

    def crew(self) -> Crew:
        """Creates the Backend crew"""
        research = self.research_task()
        reporting = self.reporting_task()
        
        return Crew(
            agents=[self.researcher(), self.reporting_analyst()],
            tasks=[research, reporting],
            process=Process.sequential,
            verbose=True,
        )