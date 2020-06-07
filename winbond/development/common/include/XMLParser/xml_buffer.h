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

 * FileName    : CLList.c
 * Description : 
 * Author      : Manish. T
 		  
************************************************************************************************/

#ifndef XML_BUFFER_H_
#define XML_BUFFER_H_

typedef struct xml_buffer {
	char *buff;
	int used;
	int size;
}xml_buffer;

xml_buffer *xml_buffer_create(int size);
int xml_buffer_append_string(xml_buffer *buffer, char *str);
int xml_buffer_append_xml_buffer(xml_buffer *buffer, xml_buffer *from);
int xml_buffer_append_buffer(xml_buffer *buffer, char *from, int length);
int xml_buffer_append_char(xml_buffer *buffer, char ch);
int xml_buffer_allocate_more(xml_buffer *buffer, int required);
char *xml_buffer_get_string(xml_buffer *buffer);
int xml_buffer_free(xml_buffer *buffer);

#endif /*XML_BUFFER_H_*/
