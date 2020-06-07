PARSERDIR = ./iniparser-2.14

CFLAGS  = -Wall -I$(PARSERDIR)/src -m32
#CFLAGS += -DDEBUG					# Uncomment to enable debug
LFLAGS  = -m32 -L$(PARSERDIR) -lini 
RM      = rm -f

all: genimage 
	rm fwinfo.o

$(PARSERDIR)/libini.a:
	@(make -C $(PARSERDIR) all)

genimage: genimage.o fmhcore.o fwinfo.o $(PARSERDIR)/libini.a
	@(echo "generating  genimage ...")
	@($(CC)  -o genimage genimage.o fwinfo.o fmhcore.o $(LFLAGS))


clean:
	@($(RM) genimage *o)
	@(make -C $(PARSERDIR) clean)


COMPILE.c=$(CC) $(CFLAGS) -c
.c.o:
	@(echo "compiling $< ...")
	@($(COMPILE.c) -o $@ $<)

