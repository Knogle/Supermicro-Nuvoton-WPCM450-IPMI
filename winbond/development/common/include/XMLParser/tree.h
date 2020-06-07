/***********************************************************************************************
************************************************************************************************
**                                                                                            **
**           Copyright (c) 2006-2007, AMERICAN MEGATRENDS Inc.	                              **
**                                                                                            **
**                               All Rights Reserved.                                         **
**                                                                                            **
**                      6145-F, Northbelt Parkway, Norcross,                                  **
**                                                                                            **
**                  Georgia - 30071, USA, Phone-(770)-246-8600.                               **
**                                                                                            **
************************************************************************************************
************************************************************************************************

 * FileName    : tree.h
 * Description :
 * Author      : Manish. T

************************************************************************************************/

#ifndef TREE_H_
#define TREE_H_

#include "include.h"
#include "stack.h"

#define createAttrNode() createNode(ATTRIBUTE_NODE)

#define NODE_NAME_LEN	256
#define NODE_VALUE_LEN	(1024 * 5)

#define XMLNS_URI			"http://www.w3.org/2000/xmlns/"
#define XML_URI				"http://www.w3.org/XML/1998/namespace"

enum NODE_TYPE
{
	ELEMENT_NODE = 1,
	ATTRIBUTE_NODE,
	TEXT_NODE,
	CDATA_SECTION_NODE,
	UNKNOWN_NODE
};
typedef enum NODE_TYPE NodeType;


// represents an xml node very much similar to Node described in DOM Level 2
typedef struct _xmlNode {

	// XML info
	NodeType nodeType;
	char *nodeName;
	char *nodeValue;

	// not as per dom spec; temporarily
	struct _xmlNode *attributes;

	char *namespaceURI;
	char *prefix;
	char *localName;

	// tree info
	struct _xmlNode *parentNode;
	struct _xmlNode *firstChild;
	struct _xmlNode *lastChild;
	struct _xmlNode *previousSibling;
	struct _xmlNode *nextSibling;

}xmlNode;

// a namespace declaration
typedef struct _NSDecl {
	char *prefix;
	char *namespaceURI;
	xmlNode *node; // node where this decl is there
	struct _NSDecl *next;	
}NSDecl;

// default namespace
typedef struct {
	char *namespaceURI;
	xmlNode *node; // node where this decl is there
}DefaultNS;


typedef struct _xmlDoc {

	xmlNode *documentElement;
	NSDecl *nsDecls;

}xmlDoc;

#define MAX_CHILD_NODES		1024
typedef struct xmlNodeList {

	xmlNode *nodes[MAX_CHILD_NODES];
	int length;

}xmlNodeList;

extern xmlNode *item(xmlNodeList *nodeList, int index);

extern xmlDoc *createXMLDoc();

extern int setDocumentElement(xmlDoc *doc, xmlNode *root);

// Creates a node with given nodeType
extern xmlNode *createNode(NodeType nodeType);

// creates an element node with tagName being NULL terminated string
extern xmlNode *createElement(char *tagName);
#define createElementNode createElement		// for old code still using it

extern xmlNode *createElementNS(char *nsURI, char *prefix, char *localName);

extern xmlNode *createAttributeNS(char *nsURI, char *prefix, char *localName, char *value);

extern int declareNamespace(xmlDoc *doc, xmlNode *node, char *namespaceURI, char *prefix);

// creates a text node using given NULL terminated node value
extern xmlNode *createTextNode(char *nodeValue);

// appends the child node to given parent node at the end of children
extern int appendChild(xmlNode* parent, xmlNode* child);

extern int freeXMLDoc(xmlDoc *doc);

// free's xml node recursively including its children
extern int freeXMLNode(xmlNode *node);

// sets the attribute node at the end of atrribute list
extern int setAttributeNode(xmlNode *node, xmlNode *attrNode);

// appends the attribute name and value as attr node at the end of atrribute list
extern int setAttribute(xmlNode *node, char *name, char *value);

// finds the attribute with given name and puts it in value, length being its length
// returns "value" if successful, else null
extern char *getAttribute(xmlNode *node, char *name, char *value, int length);

extern xmlNode *getAttributeNode(xmlNode *node, char *name);

extern xmlNodeList *getElementsByLocalName(xmlNode *node, char *localName);

extern xmlNode *cloneNode(xmlNode *node);

extern NSDecl *createNSDecl(char *nsURI, char *prefix, xmlNode *node);

extern void addNSDecl(NSDecl **start, NSDecl *decl);

extern void removeNSDecl(NSDecl *dummy, xmlNode *node);

extern void freeNSDecls(NSDecl **start);

extern void copyNSDecls(NSDecl **dest, NSDecl *src);

#endif /*TREE_H_*/
