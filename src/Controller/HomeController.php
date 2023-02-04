<?php
declare(strict_types = 1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class HomeController extends AbstractController
{
    /**
     * @param \Symfony\Component\HttpFoundation\Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[\Symfony\Component\Routing\Annotation\Route('/', name: 'home')]
    public function indexAction(Request $request): Response
    {
        return $this->render(
            'views/home/index.html.twig',
            [
            ],
        );
    }

    /**
     * @param \Symfony\Component\HttpFoundation\Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[\Symfony\Component\Routing\Annotation\Route('/profile', name: 'profile')]
    public function profileAction(Request $request): Response
    {
        return $this->render(
            'views/user/index.html.twig',
            [
            ],
        );
    }
}
