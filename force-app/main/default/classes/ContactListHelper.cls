public with sharing class ContactListHelper {


    @AuraEnabled(cacheable=True)
    public static List<Contact> getContacts(string record){
        return [SELECT Id, Name, FirstName, LastName, Photourl__c, AccountId, account.name, Phone, Email FROM Contact WHERE AccountId =: record];
    }

    @AuraEnabled(cacheable=True)
    public static List<Contact> searchContact(String searchString){
        List<List<SObject>> contacts = [FIND :searchString IN ALL FIELDS RETURNING Contact(Id, Name, FirstName, LastName, urlprofile__c, Photourl__c, AccountId, account.name, Phone, Email)];

            return (List<Contact>) contacts[0];
    }

    @AuraEnabled
    public static void deleteContacts(List<Id> contactIds){
        if(contactIds.size()>0){
            delete [SELECT Id FROM Contact WHERE Id in: contactIds];
        }
    }
}