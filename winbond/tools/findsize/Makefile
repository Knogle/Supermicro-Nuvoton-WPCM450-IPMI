PARSERDIR = ./iniparser-2.14

CFLAGS  = -Wall -I$(PARSERDIR)/src -m32
#CFLAGS += -DDEBUG					# Uncomment to enable debug
LFLAGS  = -m32 -L$(PARSERDIR) -lini
RM      = rm -f

all: findsize

$(PARSERDIR)/libini.a:
	@(make -C $(PARSERDIR) all)

findsize: findsize.o $(PARSERDIR)/libini.a
	@(echo "generating  findsize ...")
	@($(CC) -o findsize findsize.o $(LFLAGS))


clean:
	@($(RM) findsize *o)
	@(make -C $(PARSERDIR) clean)


COMPILE.c=$(CC) $(CFLAGS) -c
.c.o:
	@(echo "compiling $< ...")
	@($(COMPILE.c) -o $@ $<)

