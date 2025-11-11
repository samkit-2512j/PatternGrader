import google.generativeai as genai
import json
import sys

# Use the same API key as in gemini_api.py
API_KEY = "AIzaSyCuGwXehsJmISvQFcveQ8UwgXkKBGFMLdg"

def evaluate_code_submission(user_code, question_context, design_pattern):
    """
    Evaluates user submitted code using Gemini AI.
    
    Args:
        user_code (str): The code submitted by the user
        question_context (str): The problem description/context
        design_pattern (str): The design pattern being tested
    
    Returns:
        dict: Contains score, strengths, improvements and other evaluation data
    """
    try:
        # Initialize the Gemini client
        genai.configure(api_key=API_KEY)
        
        # Create the model - using the same model as gemini_api.py
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Create prompt for Gemini with specific instructions for structured output
        prompt = f"""
You are an expert Java code evaluator specializing in design patterns. Evaluate the following code submission:

PROBLEM DESCRIPTION:
{question_context}

EXPECTED DESIGN PATTERN:
{design_pattern}

USER CODE SUBMISSION:
```java
{user_code}
```

Please provide a thorough evaluation with the following structure (return as valid JSON):
{{
  "score": <numerical_score_between_0_and_100>,
  "strengths": [<list_of_3_to_5_strengths>],
  "improvements": [<list_of_2_to_4_improvement_suggestions>],
  "design_pattern_implementation": <description_of_how_well_the_design_pattern_was_implemented>,
  "code_quality_analysis": <analysis_of_code_quality>,
  "additional_feedback": <any_other_relevant_feedback>
}}

The score should be primarily based on how correctly the design pattern is implemented (70% weight) 
and code quality (30% weight). Be fair but appropriately critical.
"""
        
        # Generate content with a retry mechanism
        print(f"Sending evaluation request to Gemini for {design_pattern} pattern", file=sys.stderr)
        response = model.generate_content(prompt)
        
        # Parse the response to extract the JSON
        response_text = response.text
        
        # Extract the JSON part from the response (it might be wrapped in markdown code blocks)
        if "```json" in response_text:
            json_str = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            json_str = response_text.split("```")[1].split("```")[0].strip()
        else:
            json_str = response_text.strip()
            
        # Attempt to parse the JSON
        try:
            evaluation_data = json.loads(json_str)
            
            # Ensure we have the required fields
            if "score" not in evaluation_data:
                raise ValueError("Missing 'score' field in evaluation data")
                
            # Validate score is between 0 and 100
            score = int(evaluation_data["score"])
            if score < 0 or score > 100:
                score = max(0, min(100, score))  # Clamp to 0-100 range
                evaluation_data["score"] = score
                
            # Ensure we have strengths and improvements
            if "strengths" not in evaluation_data or not evaluation_data["strengths"]:
                evaluation_data["strengths"] = ["Good attempt at implementing the design pattern"]
                
            if "improvements" not in evaluation_data or not evaluation_data["improvements"]:
                evaluation_data["improvements"] = ["Consider reviewing the design pattern principles"]
                
            return {
                "score": score,
                "evaluation_data": evaluation_data
            }
            
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON from Gemini: {str(e)}", file=sys.stderr)
            print(f"Raw response: {response_text}", file=sys.stderr)
            
            # Fall back to a basic evaluation
            return {
                "score": 70,  # Default score
                "evaluation_data": {
                    "strengths": ["Submission was processed", "Code structure is present"],
                    "improvements": ["Error parsing AI evaluation, please try again"],
                    "additional_feedback": "The AI evaluation service encountered an issue processing your code."
                }
            }
            
    except Exception as e:
        print(f"Error in AI evaluation service: {str(e)}", file=sys.stderr)
        # Return a fallback evaluation
        return {
            "score": 65,  # Default slightly lower score when errors occur
            "evaluation_data": {
                "strengths": ["Submission was received"],
                "improvements": ["AI evaluation service encountered an error", 
                                "Please try resubmitting or contact support if the issue persists"],
                "error": str(e)
            }
        }

def generate_optimal_solution(question_context, design_pattern):
    """
    Generates an optimal solution for a design pattern problem using Gemini AI.
    
    Args:
        question_context (str): The problem description/context
        design_pattern (str): The design pattern to implement
    
    Returns:
        str: Java code implementing the design pattern correctly
    """
    try:
        # Initialize the Gemini client
        genai.configure(api_key=API_KEY)
        
        # Create the model
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Create prompt for Gemini to generate an optimal solution
        prompt = f"""
You are an expert Java developer specializing in design patterns. Generate a complete, optimal solution for the following design pattern problem:

PROBLEM DESCRIPTION:
{question_context}

DESIGN PATTERN TO IMPLEMENT:
{design_pattern}

Please provide a complete, working Java solution that:
1. Correctly implements the {design_pattern} design pattern
2. Follows best practices for object-oriented design
3. Includes helpful comments explaining key parts of the implementation
4. Demonstrates the pattern in action with a simple example
5. Is well-structured and uses appropriate naming conventions

Return ONLY the Java code without any explanations outside of code comments.
"""
        
        # Generate content
        print(f"Generating optimal solution for {design_pattern} pattern", file=sys.stderr)
        response = model.generate_content(prompt)
        
        # Parse the response to extract the code
        response_text = response.text
        
        # Extract the code part from the response (it might be wrapped in markdown code blocks)
        if "```java" in response_text:
            code = response_text.split("```java")[1].split("```")[0].strip()
        elif "```" in response_text:
            code = response_text.split("```")[1].split("```")[0].strip()
        else:
            code = response_text.strip()
            
        # Add a header comment to the solution
        solution = f"""/**
 * Optimal implementation of {design_pattern} design pattern
 * 
 * Problem: {question_context[:100]}...
 */
 
{code}"""

        return solution
            
    except Exception as e:
        print(f"Error generating optimal solution: {str(e)}", file=sys.stderr)
        # Return a fallback solution when errors occur
        return f"""/**
 * Error occurred while generating optimal solution.
 * Here's a generic structure for the {design_pattern} pattern.
 */
 
// Generic {design_pattern} pattern implementation
public class Solution {{
    public static void main(String[] args) {{
        // This would normally show a proper implementation of the {design_pattern} pattern
        System.out.println("An optimal {design_pattern} implementation would be shown here");
    }}
}}"""
