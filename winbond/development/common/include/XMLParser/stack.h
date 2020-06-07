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

 * FileName    : stack.h
 * Description : 
 * Author      : Manish. T
 		  
************************************************************************************************/

#ifndef STACK_H_
#define STACK_H_

typedef struct snode {
	void* address;
	struct snode* next;
}SNode;

typedef struct xmlStack {
	SNode *head;
}xmlStack;

typedef void (*StackFP)(void *address);

extern xmlStack *createStack();

extern int push(xmlStack *stack, void* address);

extern void* pop(xmlStack *stack);

extern void* peep(xmlStack *stack);

extern int freeStack(xmlStack *stack, StackFP fp);

#endif // STACK_H_
