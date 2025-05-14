from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from pydantic import BaseModel
class ChatResponse(BaseModel):
    response: str


@CrewBase
class Backend():
    """CrewAutomationForAcademicResearchAndAnswers crew"""

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
