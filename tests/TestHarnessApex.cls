public with sharing class TestHarnessApex{
    private String firstNameField = '';
    
    public FirstName{
        get{
            return firstNameField;
        }
        set(String value){
            firstNameField = value;
        }
    }

    public Integer myMethod(Integer firstInt){
        return firstInt * 2;
    }
}