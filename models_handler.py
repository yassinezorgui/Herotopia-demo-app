"""
Model Handler Module
Manages VLLM model loading and inference
"""

import torch
from pathlib import Path
from typing import List, Dict, Optional

try:
    from vllm import LLM, SamplingParams
except ImportError:
    raise ImportError("VLLM not installed. Install with: pip install vllm torch")

from config import Config


class ModelHandler:
    """
    Handles loading and inference with VLLM
    Supports streaming and batch inference
    """
    
    def __init__(self, config: Config):
        """
        Initialize the model handler
        
        Args:
            config: Configuration object containing model settings
        """
        self.config = config
        self.model = None
        self.model_name = config.MODEL_NAME
        self.max_tokens = config.MAX_TOKENS
        self.temperature = config.TEMPERATURE
        self.top_p = config.TOP_P
        
        # Load the model
        self._load_model()
    
    def _load_model(self):
        """
        Load the VLLM model
        Downloads from HuggingFace if not already cached locally
        """
        print(f"Loading model: {self.model_name}")
        print(f"This may take a few minutes on first run...")
        
        try:
            # Initialize VLLM with the model
            # Setting device_map to auto for automatic device placement
            self.model = LLM(
                model=self.model_name,
                trust_remote_code=True,
                dtype="auto",
                tensor_parallel_size=1
            )
            print(f"✓ Model loaded successfully: {self.model_name}")
        
        except Exception as e:
            print(f"✗ Failed to load model: {str(e)}")
            raise
    
    def _format_prompt(self, message: str, language: str, chat_history: List[Dict]) -> str:
        """
        Format the prompt with system message and chat history
        
        Args:
            message: Current user message
            language: Language code (en, ar, fr)
            chat_history: Previous messages for context
        
        Returns:
            Formatted prompt string
        """
        system_prompt = self.config.SYSTEM_PROMPTS.get(language, self.config.SYSTEM_PROMPTS["en"])
        
        # Build conversation history
        history_text = ""
        
        # Include recent chat history for context (limit to MAX_HISTORY_CONTEXT)
        recent_history = chat_history[-self.config.MAX_HISTORY_CONTEXT:] if chat_history else []
        
        for msg in recent_history:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "user":
                history_text += f"User: {content}\n"
            elif role == "assistant":
                history_text += f"Assistant: {content}\n"
        
        # Format complete prompt
        prompt = f"""[SYSTEM]
{system_prompt}

[CONVERSATION]
{history_text}User: {message}
Assistant: """
        
        return prompt
    
    def generate_response(self, 
                         message: str, 
                         language: str = "en",
                         chat_history: List[Dict] = None) -> str:
        """
        Generate a response using the VLLM model
        
        Args:
            message: User message
            language: Language code (en, ar, fr)
            chat_history: Previous chat messages for context
        
        Returns:
            Generated response string
        """
        if not self.model:
            raise RuntimeError("Model not loaded")
        
        if chat_history is None:
            chat_history = []
        
        # Format the complete prompt
        prompt = self._format_prompt(message, language, chat_history)
        
        try:
            # Create sampling parameters
            sampling_params = SamplingParams(
                temperature=self.temperature,
                top_p=self.top_p,
                max_tokens=self.max_tokens,
                skip_special_tokens=True
            )
            
            # Generate response
            outputs = self.model.generate(
                prompt,
                sampling_params=sampling_params
            )
            
            # Extract the generated text
            if outputs and len(outputs) > 0:
                response_text = outputs[0].outputs[0].text.strip()
                return response_text
            else:
                return "I couldn't generate a response. Please try again."
        
        except Exception as e:
            print(f"Error during generation: {str(e)}")
            return f"Error generating response: {str(e)}"
    
    def batch_generate(self, 
                      messages: List[str], 
                      language: str = "en") -> List[str]:
        """
        Generate responses for multiple messages
        
        Args:
            messages: List of user messages
            language: Language code (en, ar, fr)
        
        Returns:
            List of generated responses
        """
        if not self.model:
            raise RuntimeError("Model not loaded")
        
        # Format prompts for batch processing
        prompts = [
            self._format_prompt(msg, language, [])
            for msg in messages
        ]
        
        try:
            # Create sampling parameters
            sampling_params = SamplingParams(
                temperature=self.temperature,
                top_p=self.top_p,
                max_tokens=self.max_tokens,
                skip_special_tokens=True
            )
            
            # Generate responses in batch
            outputs = self.model.generate(
                prompts,
                sampling_params=sampling_params
            )
            
            # Extract responses
            responses = [
                output.outputs[0].text.strip() 
                for output in outputs
            ]
            
            return responses
        
        except Exception as e:
            print(f"Error during batch generation: {str(e)}")
            return [f"Error: {str(e)}"] * len(messages)


# Example usage and testing function
def test_model_handler():
    """Test function for model handler"""
    config = Config()
    handler = ModelHandler(config)
    
    # Test English
    print("\n=== Testing English ===")
    response = handler.generate_response(
        "What is photosynthesis?",
        language="en"
    )
    print(f"Response: {response}")
    
    # Test Arabic
    print("\n=== Testing Arabic ===")
    response = handler.generate_response(
        "ما هو الضوء؟",
        language="ar"
    )
    print(f"Response: {response}")
    
    # Test French
    print("\n=== Testing French ===")
    response = handler.generate_response(
        "Qu'est-ce que la biologie?",
        language="fr"
    )
    print(f"Response: {response}")


if __name__ == "__main__":
    test_model_handler()
