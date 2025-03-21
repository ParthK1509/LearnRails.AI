#include <bits/stdc++.h>
using namespace std;

int main()
{
    string s;
    cin>>s;
    int n = s.length();
    int i = 0;
    pair<vector<string>, vector<string>> parsed;
    while(s[i] != ':')
    {
        i++;
    }
    vector<string> prereq;
    vector<string> subtopics;
    cout<<"Prereq: "<<endl;
    while(s[i] != '2' && s[i+1] != ')')
    {
        string temp = "";
        while(s[i] != '-' || (s[i] != '2' && s[i+1] != ')'))
        {
            temp += s[i];
            i++;
        }
        cout<<temp<<endl;
        prereq.push_back(temp);
    }
    while(s[i] != ':')
    {
        i++;
    }
    cout<<"subtopics: "<<endl;
    while(s[i] != '}')
    {
        string temp = "";
        while(s[i] != '-')
        {
            temp += s[i];
            i++;
        }
        cout<<temp<<endl;
        subtopics.push_back(temp);
    }
    parsed = make_pair(prereq, subtopics);
    return 0;
}