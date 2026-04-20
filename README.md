# Central repo to all of Kai's visual components
Kai is a user-facing AI that functions on the following principles:
1. Surface
2. Act
3. Trace
4. Reuse

Any user, who considers to use Kai to perform the tasks they else would have done via the WizOrder UI, should have a beautiful and accurate output displayed to them. This component library forms the guideline for us to implement the same experience.
The better the generated UI, the more the user starts to trust Kai and move up the ladder to allow Kai act on it's behalf. 

This is the holy-grail of agentic products.

## How to use the repo
The repo contains <app.py> file that can be run using the 'streamlit run app.py' command.

Note: The repo requires nothing but streamlit to be installed on your system.

## Installation Instructions
- Create a directory for the repo
- Pull the contents of this constantly-updating repo using "git pull <repo_url>"
- Create a virtual environment using the command "python3 -m venv env"
- Enter the virtual environment using the command "source env/bin/action"
- Run "pip install -r requirements.txt"
- Run "streamlit run app.py"

## Exploring the Component Library
- The library contains all the components required to perform the first principle of Kai - "Surface". These include charts and widgets to provide an impeccable output to the user over the task they requested Kai to perform
- The library also includes ***downloadable React Code*** for each component and the **Required + Optional data fields** that Kai's orchestrator node needs to provide to the frontend charting library.


