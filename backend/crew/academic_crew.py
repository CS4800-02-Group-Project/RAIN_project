from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from pydantic import BaseModel

class ChatResponse(BaseModel):
    response: str

@CrewBase
class AcademicCrew():
    """Academic crew for answering academic questions"""

    @agent
    def tutor_agent(self) -> Agent:
        return Agent(
            role="Academic Tutor",
            goal="Guide students to understand concepts through explanation and examples",
            backstory="You are an experienced educator skilled at breaking down complex topics and encouraging critical thinking. You focus on helping students learn rather than providing direct answers.",
            verbose=True
        )

    @agent
    def reporting_analyst(self) -> Agent:
        return Agent(
            role="Reporting Analyst",
            goal="Format and present academic answers",
            backstory="A formatting specialist responsible for packaging academic content in a clear and structured way",
            verbose=True
        )

    @task
    def process_academic_question(self) -> Task:
        return Task(
            description="""
            Help the student with their query: {query}
            
            Depending on the type of question:
            - For conceptual questions: Explain the core ideas and provide examples
            - For problem-solving: Guide through the solution steps without giving direct answers
            - For mathematical questions: Show relevant formulas and explain their application
            - For theoretical questions: Break down complex theories into understandable parts
            
            Always aim to:
            - Encourage critical thinking
            - Use clear explanations
            - Provide relevant examples
            - Include practice opportunities when appropriate
            """,
            expected_output="""
            A helpful response that:
            - Addresses the specific question type
            - Includes clear explanations
            - Uses examples when helpful
            - Includes mathematical notation if needed ($...$ for inline math)
            """,
            agent=self.tutor_agent()
        )

    @task
    def report_results(self) -> Task:
        return Task(
            description="""
            Format and present the academic answer from the previous task.
            Make sure to:
            1. Maintain all mathematical notations
            2. Keep the hierarchical structure
            3. Preserve all examples and practice problems
            4. Format for clear readability
            """,
            expected_output="Final formatted academic response",
            agent=self.reporting_analyst(),
            output_json=ChatResponse
        )
        
        
    

    @crew
    def crew(self) -> Crew:
        """Creates the academic crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True
        )