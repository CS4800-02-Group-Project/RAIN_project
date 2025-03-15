from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
import yaml

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
            expected_output="A structured list of at least 10+ scholarly and referenceable sources, including title, author, year, abstract, source, DOI/URL, and citations in APA, MLA, IEEE, and Chicago styles.",
            agent=self.researcher(),
        )

    @task
    def reporting_task(self) -> Task:
        return Task(
            config=self.tasks_config['reporting_task'],
            expected_output="A structured markdown report containing at least 10+ referenced sources formatted with title, author, year, abstract, source, DOI/URL, and citations in APA, MLA, IEEE, and Chicago styles.",
            agent=self.reporting_analyst(),
            output_file='report.md'
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
