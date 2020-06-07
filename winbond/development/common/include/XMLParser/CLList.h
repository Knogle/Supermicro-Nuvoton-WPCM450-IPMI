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

 * FileName    : CLList.h
 * Description : 
 * Author      : Manish. T
 		  
************************************************************************************************/

#ifndef _CLL_H
#define _CLL_H

typedef struct CLLNode {
	void *address;
	struct CLLNode *next;
}CLLNode;

typedef struct CLinkedList {
	CLLNode *node;
}CLinkedList;

typedef int (*EqualFP)(void *addr1, void *addr2);
typedef int (*CLLFP)(void *address);

CLinkedList *CLL_CreateList();
int CLL_AddElement(CLinkedList *list, void *address);
int CLL_RemoveElements(CLinkedList *list, void *address, EqualFP equal, CLLFP fp);
int CLL_FreeList(CLinkedList *list, CLLFP fp);

#endif
