import Scanner from '../core/Scanner';
test('always passes 2', () => {
    const sourceCode = `
/**
 * @description This repository is for Case Database Operations
 * @author Booz Allen
 *
 */
public with sharing class VCR_CaseRepo extends VTC_BaseRepo {

    /**
     * @description Used to set the context for the databasequerylocator in metriclogic and genericbatch
     * @return String representing the query string to be used in the fetch method.
     */
    @TestVisible
    private String getQueryString() {
        String selectClause = 'SELECT ';
        String caseFieldNames;
        caseFieldNames = 'CreatedDate, Id, ParentId, RecordTypeId, OwnerId';
        String typeOfClause = 'TYPEOF Owner WHEN User THEN Name, Division WHEN Group THEN DeveloperName END';
        String fromClause = this.calculateFromClause();
        String whereClause = 'WHERE RecordType.DeveloperName IN :developerNames';
        String orderByClause = 'ORDER BY CreatedDate ASC';
        String innerQuery = '(SELECT ' + caseFieldNames + ', ' + typeOfClause + ' FROM Cases)';
        String relatedInnerQuery = '(SELECT Id, VCC_Case__c,VCC_VISN__c, VCC_Child_Case__c, RecordTypeId, VCC_Child_Case_Record_Type__c FROM Case_Metrics__r)';

        String query =
            selectClause + // SELECT
            caseFieldNames + //CreatedDate, Id, ParentId, RecordTypeId, OwnerId
            ', ' +
            typeOfClause + // TYPEOF Owner WHEN User THEN Name, Division WHEN Group THEN DeveloperName END
            ', ' +
            innerQuery + // (SELECT CreatedDate, Id, ParentId, RecordTypeId, OwnerId, TYPEOF Owner WHEN User THEN Name, Division WHEN Group THEN DeveloperName END FROM Cases)
            ', ' +
            relatedInnerQuery + // (SELECT Id, VCC_Case__c,VCC_VISN__c, VCC_Child_Case__c, RecordTypeId, VCC_Child_Case_Record_Type__c FROM Case_Metrics__r)
            ' ' +
            fromClause + // From Case
            ' ' +
            whereClause + // WHERE RecordType.DeveloperName IN :developerNames
            ' ' +
            orderByClause; // ORDER BY CreatedDate ASC

        return query;
    }
    /**
     * @description Used to set the context for the databasequerylocator in metriclogic and genericbatch
     * @return String representing the query string to be used in the fetch method.
     */
    public String getQueryLocatorString() {
        return this.getQueryString();
    }
    /**
     * @description Constructor function for VCR_CaseRepo. Calls super constructor which sets this.sObjectType to 'Case'
     *  Adds additional defaultSelectFields
     */
    public VCR_CaseRepo() {
        super(Case.SObjectType);
        this.defaultSelectFields.add('CaseNumber');
        System.debug('hi');
    }

    /**
     * @description
     * @param query query string to be used in the query locator.
     * @param bindParams representing the bind parameters to be used in the query, record types.
     * @return Database.QueryLocator representing a complex query with bind parameters on the Case object
     */
    public Database.QueryLocator getQueryLocator(String query, Map<String, Object> bindParams) {
        if ([SELECT Name, Id FROM Profile WHERE Id = :UserInfo.getProfileId() LIMIT 1].Name != 'System Administrator') {
            throw new HandledException('Only System Administrators can run this query');
        }
        
        List<Case> cases = [SELECT Name, Id FROM Profile];
        Database.update();
        cases[0].Name = 'foo';
        update cases;
        for(Case c : cases){
        	// do something
            system.debug('aaaah');
            update cases;
        }
        if (String.isNotBlank(query) && bindParams != '' && !bindParams.isEmpty()) {
            return Database.getQueryLocatorWithBinds(query, bindParams, AccessLevel.SYSTEM_MODE);
        } else {
            return null;
        }
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        
    }
    
    interface IMyInf{
    	void getSomething();
    }
}    
    `;
    Scanner.debug('(class_declaration (identifier) @ident)', sourceCode);
    expect(true).toBe(true);
});
