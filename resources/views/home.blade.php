<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <link href="{{asset("css/app.css")}}" rel="stylesheet">
    <title> {{ config('app.name') }} </title>
</head>
<body>
    <div class="header"></div>

    <div class="content-container">
        <h1 class="content-container__title">ToDo</h1>

        <form class="task-add-form" method="POST">
            @csrf
            <div class="task-add-form__circle circle"></div>
            <input class="task-add-form__input" name="name" id="name" type="text" />
            <input type='hidden' name='_method' value='' class="update__method" />
            <input type='hidden' name='update__id' value='' class="update__id" />
        </form>

        @if ($data["num"] == 0) 
            @php 
                $classDisplay = "display-no";
                $msgClassDisplay = "display-yes";
            @endphp
        @else 
            @php 
                $classDisplay = "display-yes";
                $msgClassDisplay = "display-no";
            @endphp
        @endif

        <div class="content-container__list {{$classDisplay}}">
            <div class="content-container__list__wrapper">
                @foreach($data["tasks"] as $task)
                    
                    @php $classDone = "" @endphp
                    @if($task->done == 1)
                        @php  $classDone = "task_done" @endphp
                    @endif

                    <div id="id-{{$task->id}}" class="content-container__list__item {{ $classDone }}"> 
                        <form method="POST" name="update-task" class="set__task_done">
                            @csrf
                            @method('put')
                            <button class="content-container__list__item__circle circle">
                                @include('icons.check')
                            </button>
                        </form>
                        <p class="content-container__list__item__text"> {{$task->name}} </p>
                        @include('icons.cross')
                        <input type="hidden" name="id" id="task__id" value="{{$task->id}}" />
                    </div>
                @endforeach
            </div>

            <div class="content-container__list_footer"> 
                <div class="content-container__list_footer__left-part">
                    <p> <span> {{$data["numNotCompleted"]}} </span> items left </p>
                </div>
                <div class="content-container__list_footer__middle-part">
                    <form method="POST" name="filter-task" class="filter__tasks">
                        @csrf
                        <button class="middle__part__selector filter__active"> All </button>
                        <button class="middle__part__selector"> Active </button>
                        <button class="middle__part__selector"> Completed </button>
                        <input type='hidden' value="All" class="current__filter-value"/>
                    </form>
                </div>
                <div class="content-container__list_footer__right-part">
                    <form method="POST" name="delete-task" class="clear__all__done">
                        @csrf
                        @method('delete')
                        <button type="submit" name="btn__clear-all-done"> Clear Completed </button>
                    </form>
                </div>
            </div>
        </div>

        <p class="content-container__no-tasks {{ $msgClassDisplay }}"> Currently there is no tasks. </p>
        
    </div>
    <footer>
        <div class="footer">
            <p class="footer__text"> Challenge by </p>
            <a class="footer__link" href="https://www.frontendmentor.io/"> Frontend Mentor </a> 
            <p class="footer__text"> Coded by MilosKrca </p>
        </div>
    </footer>
</body>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="{{asset("js/app.js")}}"></script>
</html>